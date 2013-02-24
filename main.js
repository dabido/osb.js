/*global define, brackets, $, window */

define(function (require, exports, module) {
    "use strict";
    var Menus                   = brackets.getModule("command/Menus"),
        CommandManager          = brackets.getModule("command/CommandManager"),
        EditorManager           = brackets.getModule("editor/EditorManager"),
        DocumentManager         = brackets.getModule("document/DocumentManager"),
        NativeFileSystem        = brackets.getModule("file/NativeFileSystem").NativeFileSystem,
        FileUtils               = brackets.getModule("file/FileUtils"),
        OsbCompiler             = require("OsbCompiler"),
        menu;
    
    
    /**    
     * Runs osb compiler for current document
     */
    function compile() {
        var doc = DocumentManager.getCurrentDocument(),
            docContent = doc.getText();
        
        OsbCompiler.compile(docContent);
    }
    
    
    /**    
     * Initialises the osb compiler (a.k.a sets the osb file from file chooser)
     */
    function activate() {
        NativeFileSystem.showOpenDialog(false, false, "Select osu! storyboard output file", "C:\\", ["osb"], function (data) {
            var filePath = data[0],
                fileEntry = new NativeFileSystem.FileEntry(filePath);
            
            OsbCompiler.setOsbFile(fileEntry);
        }, function (data) {
            
        });
    }
    
    
    $(DocumentManager).on("documentSaved", function (event, doc) {
        var fileSplitted = doc.file.name.split("."),
            extension = fileSplitted.slice(fileSplitted.length - 2, fileSplitted.length).join(".");
        
        if (extension === "osb.js") {
            compile();
        }
    });


    CommandManager.register("Set output File", "osbActivate", activate);
    
    menu = Menus.addMenu("Osb.js", "edgedocks.custom.menu");
    menu.addMenuItem("osbActivate");
});