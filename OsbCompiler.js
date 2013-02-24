/*global define, brackets, $*/

define(function (require, exports, module) {
    "use strict";
    
    var commandName         = "addCopyright",
        Menus                   = brackets.getModule("command/Menus"),
        CommandManager          = brackets.getModule("command/CommandManager"),
        EditorManager           = brackets.getModule("editor/EditorManager"),
        DocumentManager         = brackets.getModule("document/DocumentManager"),
        NativeFileSystem        = brackets.getModule("file/NativeFileSystem").NativeFileSystem,
        FileUtils               = brackets.getModule("file/FileUtils"),
        osbFileEntry            = null;
    
    
    /**    
     * Sets the osbFile    
     * @param {FileEntry} fileEntry file handle for the osb file    
     */
    function setOsbFile(fileEntry) {
        osbFileEntry = fileEntry;
    }
    
    
    /**    
     * Reads text from file    
     * @param {string} filePath the path to load
     * @return Deferred 
     */
    function getFileContent(filePath) {
        var defer, fileEntry;
        defer = $.Deferred();
        
        fileEntry = new NativeFileSystem.FileEntry(require.toUrl(filePath));
        FileUtils.readAsText(fileEntry)
            .done(function (fileContent) {
                defer.resolve(fileContent);
            });
        
        return defer;
    }
    
    
    /**    
     * Combines the content of a array of files
     * @param {array} files Array with file urls    
     * @param {function} callback callback when the whole merging process finished    
     */
    function combineFiles(files, callback) {
        if (callback === undefined) {
            callback = function () {};
        }
        
        var file, mergedContent, fileEntry, promises, defer, i, filepath;
        mergedContent = "";
        promises = [];
        
        for (file in files) {
            filepath = files[file];
            defer = getFileContent(filepath);
            promises.push(defer);
            
            defer.done(function (data) {
                mergedContent = mergedContent + data + " ";
            });
        }
        
        $.when.apply($, promises).done(function () {
            callback(mergedContent);
        });
    }
    
    
    /**    
     * Writes text to osbFileEntry
     * @param {string} content The text to write    
     * @param {function} callback function to execute once writing is completed
     */
    function writeOsb(content, callback) {
        if (callback === undefined) {
            callback = function () {};
        }
        
        FileUtils.writeText(osbFileEntry, content).done(function (data) {
            callback(data);
        });
    }
    
    
    /**    
     * Combines content with the library and executes    
     * @param {string} content some javascript    
     */
    function compile(content) {
        if (osbFileEntry === null) {
            return;
        }
        
        combineFiles(["lib/SpriteManager.js", "lib/Layer.js", "lib/Origin.js", "lib/Sprite.js", "lib/Effect.js"], function (data) {
            // Generate huuuuge document
            var doc = data + " " + content,
                sprite = eval(doc),
                spriteManager = sprite.manager,
                sprites = spriteManager.get(),
                output = [],
                chainEntry,
                chain;
            
            for (sprite in sprites) {
                chain = sprites[sprite].getChain();
                output.push(chain.join("\r\n"));
            }
            
            writeOsb("[Events]\r\n" + output.join("\r\n\r\n") + "\r\n ");
        });
    }
   
    exports.setOsbFile = setOsbFile;
    exports.compile = compile;
});