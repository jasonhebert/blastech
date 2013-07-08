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


function QblResult() {
	//Save a reference to this
	me=this;

	//xml result

    this.qblDoc = null;
    
}

QblResult.prototype.populateQblTree = function(qblXML)
{

    this.qblDoc = qblXML;

    var nr = this.getQblNum();
    removeRows(guiQblListTree);
    for(var i=0;i<nr;i++)
    {
        var rowID = this.qblDoc.getElementsByTagName("ENTRY")[i].attributes['id'].value;

        var item = document.createElement('treeitem');
        var row = document.createElement('treerow');
        row.setAttribute('id',rowID);
        
        var cell_PN = document.createElement('treecell');
        cell_PN.setAttribute('label',this.qblDoc.getElementsByTagName("ENTRY")[i].attributes['pn'].value);
        
        var cell_Loc = document.createElement('treecell');
        cell_Loc.setAttribute('label',this.qblDoc.getElementsByTagName("ENTRY")[i].attributes['loc'].value);
        
        var cell_Qty = document.createElement('treecell');
        cell_Qty.setAttribute('label',this.qblDoc.getElementsByTagName("ENTRY")[i].attributes['qty'].value);
        
        row.appendChild(cell_PN);
        row.appendChild(cell_Loc);
        row.appendChild(cell_Qty);
        item.appendChild(row);
        guiQblListTree.appendChild(item);
    }

    
    
}


//Number Records in the xmlDoc - it doesn't count the record deleted by the user
QblResult.prototype.getQblNum = function() {

	var el = this.qblDoc.getElementsByTagName("ENTRY");

    if(el.length) {
        return el.length;
	}else{
		return 0;
	}
}
