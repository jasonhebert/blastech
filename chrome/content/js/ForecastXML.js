/*
 *===============================================================================
 *
 * Main  BlastechResult JS file. It starts fetches XML data.
 *
 * @FileName: ForecastXML.js
 *
 * @Author: Jason Hebert
 * @Copyright Northrop Grumman Ship Systems
 *
 * @Version 0.3
 * @Revision History: 12/01/2003 - Begin development
 *
 *===============================================================================
 */


function ForecastResult() {
  //Save a reference to this
  me = this;

  //xml result
  this.xmlDoc = null;
  this.qblDoc = null;

  this.sType = null;

  this.sText = null;

  this.sHull = null;
}

ForecastResult.prototype.populateForecastTree = function(foreXML, qblXML, qText, qPopup, qHull) {
  this.xmlDoc = foreXML;
  this.qblDoc = qblXML;
  this.sType = qPopup;
  this.sText = qText;
  this.sHull = qHull;

  var nr = this.getForeNum();
  var noBill = true;
  removeRows(guiForecastListTree);

  switch (this.sType) {
    case "Bill":
      for (var i = 0; i < nr; i++) {

        var billNum = this.xmlDoc.getElementsByTagName("BILL")[i].attributes['billnum'].value;
        if (billNum == this.sText) {
          noBill = false;
          var er = this.xmlDoc.getElementsByTagName("BILL")[i].getElementsByTagName('ENTRY').length;
          for (var y = 0; y < er; y++) {
            var hullNum = this.xmlDoc.getElementsByTagName("BILL")[i].getElementsByTagName('ENTRY')[y].attributes['hull'].value;

            if (hullNum == this.sHull) {
              var rowID = this.xmlDoc.getElementsByTagName("BILL")[i].getElementsByTagName('ENTRY')[y].attributes['id'].value;

              var item = document.createElement('treeitem');
              var row = document.createElement('treerow');
              row.setAttribute('id', rowID);

              var cell_ID = document.createElement('treecell');
              cell_ID.setAttribute('label', this.xmlDoc.getElementsByTagName("BILL")[i].getElementsByTagName('ENTRY')[y].attributes['id'].value);

              var cell_PN = document.createElement('treecell');
              cell_PN.setAttribute('label', this.xmlDoc.getElementsByTagName("BILL")[i].getElementsByTagName('ENTRY')[y].attributes['partnum'].value);

              var cell_Hull = document.createElement('treecell');
              cell_Hull.setAttribute('label', this.xmlDoc.getElementsByTagName("BILL")[i].getElementsByTagName('ENTRY')[y].attributes['hull'].value);

              var cell_Bill = document.createElement('treecell');
              cell_Bill.setAttribute('label', this.xmlDoc.getElementsByTagName("BILL")[i].attributes['billnum'].value);

              var cell_SchDate = document.createElement('treecell');
              cell_SchDate.setAttribute('label', this.xmlDoc.getElementsByTagName("BILL")[i].getElementsByTagName('ENTRY')[y].attributes['schdate'].value);

              var cell_OOC = document.createElement('treecell');
              cell_OOC.setAttribute('label', this.xmlDoc.getElementsByTagName("BILL")[i].getElementsByTagName('ENTRY')[y].attributes['ooc'].value);

              var cell_UM = document.createElement('treecell');
              cell_UM.setAttribute('label', this.xmlDoc.getElementsByTagName("BILL")[i].getElementsByTagName('ENTRY')[y].attributes['um'].value);

              row.appendChild(cell_ID);
              row.appendChild(cell_PN);
              row.appendChild(cell_Hull);
              row.appendChild(cell_Bill);
              row.appendChild(cell_SchDate);
              row.appendChild(cell_OOC);
              row.appendChild(cell_UM);
              item.appendChild(row);
              guiForecastListTree.appendChild(item);
            }
          }
        } else {

        }
      }

      if (noBill == true) {
        alert("Bill number " + this.sText + ".");
      }
      break;

    case "Hull":

      break;

    case "PN":

      break;

    default:

      break;

  }



}

ForecastResult.prototype.populateQblTree = function(idx) {
  removeRows(guiQblListTree);

  var xl = this.qblDoc.getElementsByTagName("ENTRY").length;

  for (a = 0; a < xl; a++) {
    var pnText = guiForecastTree.view.getCellText(idx, "forecast-partnum-col");

    if (this.qblDoc.getElementsByTagName("ENTRY")[a].attributes['pn'].value == pnText) {

      var rowID = this.qblDoc.getElementsByTagName("ENTRY")[a].attributes['id'].value;

      var item = document.createElement('treeitem');
      var row = document.createElement('treerow');
      row.setAttribute('id', rowID);

      var cell_ID = document.createElement('treecell');
      cell_ID.setAttribute('label', guiForecastTree.view.getCellText(idx, 'forecast-id-col'));

      var cell_PN = document.createElement('treecell');
      cell_PN.setAttribute('label', this.qblDoc.getElementsByTagName("ENTRY")[a].attributes['pn'].value);

      var cell_HULL = document.createElement('treecell');
      cell_HULL.setAttribute('label', guiForecastTree.view.getCellText(idx, 'forecast-hull-col'));

      var cell_OH = document.createElement('treecell');
      cell_OH.setAttribute('label', this.qblDoc.getElementsByTagName("ENTRY")[a].attributes['qty'].value);

      var cell_OOC = document.createElement('treecell');
      cell_OOC.setAttribute('label', guiForecastTree.view.getCellText(idx, 'forecast-oocvrd-col'));

      row.appendChild(cell_ID);
      row.appendChild(cell_PN);
      row.appendChild(cell_HULL);
      row.appendChild(cell_OH);
      row.appendChild(cell_OOC);
      item.appendChild(row);
      guiQblListTree.appendChild(item);
    }
  }



}

//Number Records in the xmlDoc - it doesn't count the record deleted by the user
ForecastResult.prototype.getForeNum = function() {
  var el = this.xmlDoc.getElementsByTagName("BILL");
  if (el.length) {
    return el.length;
  } else {
    return 0;
  }
}

ForecastResult.prototype.sortResult = function(el, tagName) {
  if (!this.xmlDoc) return false;

  var bAscending = el.getAttribute('ascending');

  if (bAscending == "true") bAscending = true
  else bAscending = false;

  var sortType = el.getAttribute('class');
  var sortTag = tagName;


  if (bAscending) {
    el.setAttribute('ascending', 'false');
  } else {
    el.setAttribute('ascending', 'true');
  }


  var theBody = this.xmlDoc.getElementsByTagName("ProductInfo").item(0);
  var theRows = this.xmlDoc.getElementsByTagName("Details");
  var numRows = this.getNrRecord();

  var theSortedRows = new Array(numRows);

  var i;
  for (i = 0; i < numRows; i++) {
    theSortedRows[i] = theRows[i].cloneNode(true);
  }

  theSortedRows.sort(this.sortCallBack(sortType, sortTag, bAscending))


  //Copy

  while (theBody.hasChildNodes()) {
    theBody.removeChild(theBody.lastChild);
  }

  for (i = 0; i < numRows; i++) {
    theBody.appendChild(theSortedRows[i])
  }

  removeRows();
  this.createTree();

}

ForecastResult.prototype.sortCallBack = function(sortType, sortTag, bAscending) {

  var fTypeCast = String;
  var asc = bAscending;

  switch (sortType) {
    case "numeric":
      fTypeCast = toNumber;
      break;
    case "date":
      fTypeCast = toYear;
      break;
    default:
      fTypeCast = CaseInsensitiveString;

  }


  return function(a, b) {

    var col1 = a.getElementsByTagName(sortTag);
    var col2 = b.getElementsByTagName(sortTag);

    if (col1.length) var text1 = col1.item(0).firstChild.nodeValue
    else var text1 = 0;

    if (col2.length) var text2 = col2.item(0).firstChild.nodeValue;
    else var text2 = 0;



    if (fTypeCast(text1) < fTypeCast(text2)) {
      return asc ? -1 : 1;
    } else if (fTypeCast(text1) > fTypeCast(text2)) {
      return asc ? 1 : -1;
    } else {
      return 0;
    }
  };

}