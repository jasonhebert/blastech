/*** -*- Mode: Javascript; tab-width: 2;

The contents of this file are subject to the Mozilla Public
License Version 1.1 (the "License"); you may not use this file
except in compliance with the License. You may obtain a copy of
the License at http://www.mozilla.org/MPL/

Software distributed under the License is distributed on an "AS
IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
implied. See the License for the specific language governing
rights and limitations under the License.

The Original Code is jslib team code.
The Initial Developer of the Original Code is jslib team.

Portions created by jslib team are
Copyright (C) 2000 jslib team.  All
Rights Reserved.

Original Author: Pete Collins <pete@mozdev.org>
Contributor(s): Martin Kutschker <Martin.T.Kutschker@blackbox.net>

***/

/** 
 * insure jslib base is not already loaded
 */
if (typeof(JS_LIB_LOADED)!='boolean') {
try {

/*************************** GLOBALS ***************************/
const JS_LIB_LOADED     = true;

const JS_LIBRARY        = "jslib";
const JS_LIB_FILE       = "jslib.js"
const JS_LIB_PATH       = "chrome://blastech/content/js/";
const JS_LIB_VERSION    = "0.1.64";
const JS_LIB_AUTHORS    = "\tPete Collins       <petejc@mozdevgroup.com>\n"     +
                          "\tEric Plaster       <plaster@urbanrage.com>\n"    +
                          "\tMartin.T.Kutschker <Martin.T.Kutschker@blackbox.net>\n";
const JS_LIB_BUILD      = "mozilla 1.3+";
const JS_LIB_ABOUT      = "\tThis is an effort to provide a fully "   +      
                          "functional js library\n"                   +
                          "\tfor mozilla package authors to use "     + 
                          "in their applications\n";
const JS_LIB_HOME       = "http://jslib.mozdev.org/";

// Hopefully there won't be any global namespace collisions here
const ON                = true;
const OFF               = false;
const C                 = Components;

var JS_LIB_DEBUG        = ON;
var JS_LIB_DEBUG_ALERT  = OFF;
var JS_LIB_ERROR        = ON;
var JS_LIB_ERROR_ALERT  = OFF;

const JS_LIB_HELP       = "\n\nWelcome to jslib version "+JS_LIB_VERSION+"\n\n" 
                          + "Global Constants:\n\n"                               
                          + "JS_LIBRARY     \n\t"+JS_LIBRARY     +"\n"
                          + "JS_LIB_FILE    \n\t"+JS_LIB_FILE    +"\n"                 
                          + "JS_LIB_PATH    \n\t"+JS_LIB_PATH    +"\n"
                          + "JS_LIB_VERSION \n\t"+JS_LIB_VERSION +"\n"
                          + "JS_LIB_AUTHORS \n"  +JS_LIB_AUTHORS
                          + "JS_LIB_BUILD   \n\t"+JS_LIB_BUILD   +"\n" 
                          + "JS_LIB_ABOUT   \n"  +JS_LIB_ABOUT
                          + "JS_LIB_HOME    \n\t"+JS_LIB_HOME    +"\n\n"
                          + "Global Variables:\n\n"            
                          + "  JS_LIB_DEBUG\n  JS_LIB_ERROR\n\n";

// help identifier
const jslib_help = "need to write some global help docs here\n";

// Library Identifiers

// io library modules
const jslib_io         = JS_LIB_PATH+'io/io.js';
const jslib_filesystem = JS_LIB_PATH+'io/filesystem.js'
const jslib_file       = JS_LIB_PATH+'io/file.js';
const jslib_fileutils  = JS_LIB_PATH+'io/fileUtils.js';
const jslib_dir        = JS_LIB_PATH+'io/dir.js';
const jslib_dirutils   = JS_LIB_PATH+'io/dirUtils.js';

// xul dom library modules
const jslib_dialog      = JS_LIB_PATH+'xul/commonDialog.js';
const jslib_filepicker  = JS_LIB_PATH+'xul/commonFilePicker.js';
const jslib_window      = JS_LIB_PATH+'xul/commonWindow.js';
const jslib_routines    = JS_LIB_PATH+'xul/appRoutines.js';

// sound library modules
const jslib_sound = JS_LIB_PATH+'sound/sound.js';

// utils library modules
const jslib_date     = JS_LIB_PATH+'utils/date.js';
const jslib_prefs    = JS_LIB_PATH+'utils/prefs.js';
const jslib_validate = JS_LIB_PATH+'utils/validate.js';

// zip
const jslib_zip  = JS_LIB_PATH+'zip/zip.js';

/*************************** GLOBALS ***************************/

/****************************************************************
* void include(aScriptPath)                                     *
* aScriptPath is an argument of string lib chrome path          *
* returns NS_OK on success, 1 if file is already loaded and     *
* - errorno or throws exception on failure                      *
*   Ex:                                                         * 
*       var path='chrome://jslib/content/io/file.js';           *
*       include(path);                                          *
*                                                               *
*   outputs: void(null)                                         *
****************************************************************/

function include(aScriptPath) {

  if (!aScriptPath) {
    jslibError(null, "Missing file path argument\n", 
                      "NS_ERROR_XPC_NOT_ENOUGH_ARGS", 
                      JS_LIB_FILE+": include");
    throw - C.results.NS_ERROR_XPC_NOT_ENOUGH_ARGS;
  }

  if (aScriptPath==JS_LIB_PATH+JS_LIB_FILE) {
    jslibError(null, aScriptPath+" is already loaded!", 
        "NS_ERROR_INVALID_ARG", JS_LIB_FILE+": include");
    throw - C.results.NS_ERROR_INVALID_ARG;
  }

  var start   = aScriptPath.lastIndexOf('/') + 1;
  var end     = aScriptPath.lastIndexOf('.');
  var slice   = aScriptPath.length - end;
  var loadID  = aScriptPath.substring(start, (aScriptPath.length - slice));
  try {
    if (typeof(eval('JS_'+loadID.toUpperCase()+'_LOADED')) == 'boolean') {
      jslibPrint (loadID+" library already loaded");
      return 1;
    }
  } catch (e) {}

  var rv;
  try {
    const PROG_ID   = "@mozilla.org/moz/jssubscript-loader;1";
    const INTERFACE = "mozIJSSubScriptLoader";
    const Inc       = new C.Constructor(PROG_ID, INTERFACE);
    (new Inc()).loadSubScript(aScriptPath);
    rv = C.results.NS_OK;
  } catch (e) {
    const msg = aScriptPath+" is not a valid path or is already loaded";
    jslibError(e, msg, "NS_ERROR_INVALID_ARG", JS_LIB_FILE+": include");
    rv = - C.results.NS_ERROR_INVALID_ARG;
  }
  return rv;
}

/****************************************************************
* void jslibDebug(aOutString)                                  *
* aOutString is an argument of string debug message             *
* returns void                                                  *
*   Ex:                                                         * 
*       var msg='Testing function';                             *
*       jslibDebug(msg);                                        *
*                                                               *
*   outputs: Testing function                                   *
****************************************************************/

// this is here for backward compatability but is deprecated --masi
function jslib_debug(aOutString) { return jslibDebug(aOutString); }

function jslibDebug(aOutString) {

  if (!JS_LIB_DEBUG)
    return; 

  if (JS_LIB_DEBUG_ALERT)
    alert(aOutString);

  dump(aOutString+'\n');
  return;
}

// print to stdout
function jslibPrint(aOutString) {
  return (dump(aOutString+'\n'));
}

// Welcome message
jslibDebug(JS_LIB_HELP);
jslibDebug("\n\n*********************\nJS_LIB DEBUG IS ON\n*********************\n\n");


/****************************************************************
* void jslibError(e, aType, aResults, aCaller)                  *
* e        - argument of results exception                      *
* aType    - argument of string error type message              *
* aResults - argument of string Components.results name         *
* aCaller  - argument of string caller filename and func name   *
* returns void                                                  *
*   Ex:                                                         * 
*       jslibError(null, "Missing file path argument\n",        *
*                 "NS_ERROR_XPC_NOT_ENOUGH_ARGS",               *
*                 JS_LIB_FILE+": include");                     *
*                                                               *
*   outputs:                                                    *
*       -----======[ ERROR ]=====-----                          *
*       Error in jslib.js: include:  Missing file path argument *
*                                                               *
*       NS_ERROR_NUMBER:   NS_ERROR_XPC_NOT_ENOUGH_ARGS         *
*       ------------------------------                          *
*                                                               *
****************************************************************/

function jslibError(e, aType, aResults, aCaller) {

  if (!JS_LIB_ERROR)
    return void(null);

  if (arguments.length==0)
    return (dump("JS_LIB_ERROR=ON\n"));

  var errMsg="ERROR: "+(aCaller?"in "+aCaller:"")+"  "+aType+"\n";
  if (e) {
		var m, n, r, l, ln, fn = "";
		try {
      var r  = e.result;
      var m  = e.message;
		  var fn = e.filename;
      var l  = e.location; 
      var ln = l.lineNumber; 
		} catch (e) {}
    errMsg+="Name:              "+e.name+"\n"       +
            "Result:            "+r+"\n"            +
            "Message:           "+m+"\n"            +
            "FileName:          "+fn+"\n"           +
            "LineNumber:        "+ln+"\n";
  }
  if (aResults)
    errMsg+="NS_ERROR_NUMBER:   "+aResults+"\n";

  if (JS_LIB_ERROR_ALERT)
    alert(errMsg);

  errMsg = "\n-----======[ ERROR ]=====-----\n" + errMsg;
  errMsg += "------------------------------\n\n";

  return (dump(errMsg));
}

function jslibGetService (aURL, aInterface) {
  var rv;
  try {
    rv =  C.classes[aURL].getService(C.interfaces[aInterface]);
  } catch (e) {
    jslibDebug("Error getting service: " + aURL + ", " + aInterface + "\n" + e);
    rv = -1;
  }
  return rv;
}
 
function jslibCreateInstance (aURL, aInterface) {
  var rv;
  try {
    rv = C.classes[aURL].createInstance(C.interfaces[aInterface]);
  } catch (e) {
    jslibDebug("Error creating instance: " + aURL + ", " + aInterface + "\n" + e);
    rv = -1;
  }
  return rv;
}
 
/************
   QI: function(aEl, aIName)
   {
     try {
       return aEl.QueryInterface(Components.interfaces[aIName]);
     } catch (ex) {
       throw("Unable to QI " + aEl + " to " + aIName);
     }
   }
************/


} catch (e) {}

} // end jslib load test