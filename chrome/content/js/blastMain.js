/*
 *===============================================================================
 *
 * Main  Blastech JS file.
 *
 * @FileName: blastMain.js
 *
 * @Author: Jason Hebert
 * @Copyright Northrop Grumman Ship Systems
 *
 * @Version 0.3
 * @Revision History: 12/01/2003 - Begin development
 *
 *===============================================================================
 */


const BLAST_VERSION = "0.3.0.0";

//user | developer 
const BLAST_RELEASE = "user";

//Output Format
f = "xml";

//Activate Debug panel
if (BLAST_RELEASE == "user") {
  debugMode = false;
} else {
  debugMode = true;
}


function main() {
  /*	Get a reference to GUI Element 	*/
  //Search Hull Input
  guiSearchPopup = document.getElementById('search-popup');
  //Search Bill Input
  guiSearchText = document.getElementById('search-text');
  //Search Bill Input
  guiHullText = document.getElementById('hull-text');
  //General Status Bar Message
  guiStatusBar = document.getElementById('out-status');
  //Nr Record fetched status bar message
  guiRecordStatus = document.getElementById('record-status');
  //Search Button
  searchBtn = document.getElementById('find-button');
  //Clear Button Toolbar
  clearBtn = document.getElementById('clear-btn');
  //Clear Button Search Bar
  clearButton = document.getElementById('clear-button');
  //Forecast Result Tree
  guiForecastTree = document.getElementById('forecast-tree');
  //Forecast List result
  guiForecastListTree = document.getElementById('forecast-list-tree');
  //Select Result Tree
  guiQblTree = document.getElementById('qbl-tree');
  //Select List result
  guiQblListTree = document.getElementById('qbl-list-tree');
  //Req Result Tree
  guiReqTree = document.getElementById('req-tree');
  //Req List result
  guiReqListTree = document.getElementById('req-list-tree');
  //Debug Output	
  guiDebugOut = document.getElementById('debug-output');
  guiDebugSplitter = document.getElementById('debug-splitter');
  guiReqOutput = window.frames[0].document.getElementById('commentOutput');



  //Focus on Hull textbox
  importForeXML();
  window.focus();
  guiSearchText.focus();

}

function importForeXML() {
  
  foreFile = document.implementation.createDocument("", "", null);
  foreFile.load("XML/forecastXML.xml");

  qblFile = document.implementation.createDocument("", "", null);
  
  qblFile.load("XML/qblXML.xml");

  guiHullText.value = "7208";
  guiSearchText.value = "LHD100128*";

}

function removeRows(theTree) {
  while (theTree.hasChildNodes()) {
    theTree.removeChild(theTree.lastChild);
  }
}

function saveListAs(targetNodeID) {
  var d = new DirUtils;
  var myUserDirPlease = d.getUserChromeDir();
  var targetNodeID2 = targetNodeID;
  var fName = txtFilePicker("Save the File as", 1, myUserDirPlease);
  if (fName == null) {
    return false;
  }

  var isSaved = saveAFile(fName, targetNodeID2);
  
  return isSaved;
}

function saveAFile(aUrl, targetNodeID) {

  var aFile = aUrl;
  if (aUrl.substring(0, 4) == "file") {
    var fUtils = new FileUtils();
    aFile = fUtils.urlToPath(aUrl);
  }

  var f = new File(aFile);
  if (!f.open("w")) {
    alert("File could not be opened!");
    return false;
  }
  
  var responseXML = new DOMParser().parseFromString(qblFile, 'text/xml');
  alert(toString(responseXML));
  return;
  var data = targetNodeID;
  f.write(data);
  f.close();

  
  return true;
}

function txtFilePicker(aTitle, aSave) {
  var retVal = null;
  try {

    const nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, aTitle, (aSave ? nsIFilePicker.modeSave : nsIFilePicker.modeOpen));
    fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);

    
    var result = fp.show();
    if (result == nsIFilePicker.returnOK || result == nsIFilePicker.returnReplace) {
      
      retVal = fp.file.path;
      
    }
  } catch (ex) {}
  return retVal;
}

function getHullTextInput() {
  if (guiHullText.value != "") {
    return guiHullText.value;
  } else {
    return false;
  }
}

function getSearchTextInput() {
  if (guiSearchText.value != "") {
    return guiSearchText.value;
  } else {
    return false;
  }
}

function getSearchType() {
  if (guiSearchPopup.value != "") {
    return guiSearchPopup.value;
  } else {
    return false;
  }
}

function loadTrees() {
  loadForeTree();
  loadQblTree();
}

function loadForeTree() {
  if (typeof myFore == 'undefined') {
    myFore = new ForecastResult();
  }


  if (!myFore) {
    alert("No myFore");
    return;
  }

  var qText = getSearchTextInput();
  var qPopup = getSearchType();
  var qHull = getHullTextInput();

  if (!qPopup) {
    return;
  } else if (!qText) {
    alert("No " + qPopup + " number entered.");
    return;
  } else if (!qHull) {
    alert("No " + qPopup + " number entered.");
    return;
  } else {
    myFore.populateForecastTree(foreFile, qblFile, qText, qPopup, qHull);
  }
}

function loadQblTree(newQblFile) {

  if (typeof myQbl == 'undefined') {
    myQbl = new QblResult();
  }


  if (!myQbl) {
    alert("No myQbl");
    return;
  }
  alert("here");
  myQbl.populateQblTree(newQblFile);

}

function showQBL(idx) {
  if (idx == -1 || typeof idx == 'undefined') {
    var idx = guiForecastTree.currentIndex;
  }
  if (idx == -1) return;
  
  myFore.populateQblTree(idx);
}


function importXML() {

  xmlDoc = document.implementation.createDocument("", "", null);
  xmlDoc.onload = createTable;

  xmlDoc.load("XML/forecastXML.xml");
}


function createTable() {
  var x = xmlDoc.getElementsByTagName('BILL');
  alert(x.length);
}


function printDebug(txt) {
  if (debugMode) {
    //Write
    if (txt != "") {
      var item = document.createElement('treeitem');
      var row = document.createElement('treerow');

      var newRow = document.createElement('treecell');
      newRow.setAttribute('label', unescape(txt));

      row.appendChild(newRow);
      item.appendChild(row);
      guiDebugOut.appendChild(item);
    }
    return true;
  } else {
    return false;
  }
}

function loadIt() {
  var d = new DirUtils;
  var p = d.getChromeDir();
  p = p + "\\blastech\\content\\xml";

  var fName = "qblXML.xml";

  var f = new File(p);
  var target = f.nsIFile;
  var target2 = target;
  target.append(fName);

  f = new File(target.path);

  //If file already exists then just open it.
  if (f.exists()) {
    f.open()
    var stuff = f.read()
    f.close()
    loadQblTree(stuff);
  }

  // If it doesn't exist, create the file, then make sure it exists, then open.
  else if (!f.exists()) {
    f.create();

    if (f.exists()) {
      f.open()
      var stuff = f.read()
      f.close()
      setTextareaText(stuff, targetNodeID);
    } else {
      setTextareaText('// #2 Currently you do not have a user.js file.', targetNodeID)
    }

  } else {
    setTextareaText('// #1 Currently you do not have a user.js file.', targetNodeID)
  }

}

function loadForecastTXT() {
  var d = new DirUtils;
  var p = d.getChromeDir();
  p = p + "\\blastech\\content\\xml\\forecast.txt";



  var f = new File(p);

  var k = new DirUtils;
  var u = k.getChromeDir();
  u = u + "\\blastech\\content\\xml\\forecastnew.txt";



  var hy = new File(u);

  //If file already exists then just open it.
  if (!hy.exists()) {
    hy.create();
  }

  if (hy.exists()) {
    hy.open("w")
    //If file already exists then just open it.

    if (f.exists()) {
      f.open("r")


      var stuff = f.read();
      //var newStuff = stuff.split(/[\n]/);
      var newStuff = stuff.split(String.fromCharCode(13) + String.fromCharCode(10));
      //alert(newStuff.length);
      var holder = "<?xml version='1.0' encoding='UTF-8'?>" + String.fromCharCode(10) + String.fromCharCode(10);
      holder = holder + "<ROOT>" + String.fromCharCode(10);
      for (var g = 0; g < 5000; g++) {
        if (parseFloat(trim(newStuff[g].substr(53, 12))) > 0) {
          holder = holder + '\t' + "<ENTRY id='" + g + "' pn='" + trim(newStuff[g].substr(0, 15)) + "' ";
          holder = holder + "hull='" + trim(newStuff[g].substr(15, 4)) + "' ";
          holder = holder + "bill='" + trim(newStuff[g].substr(19, 17)) + "' ";
          holder = holder + "schdate='" + trim(newStuff[g].substr(45, 8)) + "' ";
          holder = holder + "ooc='" + parseFloat(trim(newStuff[g].substr(53, 12))) + "' ";
          holder = holder + "um='" + trim(newStuff[g].substr(37, 4)) + "' />" + String.fromCharCode(10);
        }
        


      }
      holder = holder + "</ROOT>";

      f.close()

    } else {
      alert("You Suck Too!"); //It obviously doesn't exist if you get to here...
    }
  }
  holder.replace(/String.fromCharCode(10)/g, "<br />");
  holder.replace(/String.fromCharCode(13)/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
  hy.write(holder);
  guiReqOutput.innerHTML = "";


  guiReqOutput.innerHTML = escape(holder);
  hy.close()
}

function parseForecastTxt(stuff) {
  guiDebugOut.value = stuff;
  return;
  alert(stuff.length);
  splitUpStuff = stuff.split("\n");
  alert(splitUpStuff.length);
  alert(splitUpStuff[0]);


}

function trim(s) {
  while (s.substring(0, 1) == ' ') {
    s = s.substring(1, s.length);
  }
  while (s.substring(s.length - 1, s.length) == ' ') {
    s = s.substring(0, s.length - 1);
  }
  return s;
}