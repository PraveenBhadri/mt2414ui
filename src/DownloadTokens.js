/**
 * @module src/DownloadTokens
 *
 * Component that display SourceDocument
 * Accepts the following properties:
 *  - language: Ethnologue code of the language
 *  - version: Version of the language
 *  - revision: Autogenerated for each updation of this same source
*/

import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import $ from 'jquery';
import GlobalURL from './GlobalURL';
import ListTargetLanguage from './Component/ListTargetLanguage';
import Checkbox from './Checkbox';
import booksName2 from './BookName';
import ListLanguages from './Component/ListLanguages'
import Versions from './Component/Versions';
import RevisionNumber from './Component/RevisionNumber';


var tabData = [
  { name: 'Include Books', isActive: true },
  { name: 'Exclude Books', isActive: false }
];

//Bookarray for canonical order
var BookArray = ["GEN" : "Genesis", "EXO" : "Exodus", "LEV" : "Leviticus", "NUM" : "Numbers", "DEU" : "Deuteronomy", "JOS" : "Joshua", "JDG" : "Judges", "RUT" : "Ruth", "1SA" : "1 Samuel", "2SA" : "2 Samuel", "1KI" : "1 Kings", "2KI" : "2 Kings", "1CH" : "1 Chronicles", "2CH" : "2 Chronicles", "EZR" : "Ezra", "NEH" : "Nehemiah", "EST" : "Esther", "JOB" : "Job", "PSA" : "Psalms", "PRO" : "Proverbs", "ECC" : "Ecclesiastes", "SNG" : "Songs of Solomon", "ISA" : "Isaiah", "JER" : "Jeremiah", "LAM" : "Lamentations", "EZE" : "Ezekiel", "DAN" : "Daniel", "HOS" : "Hosea", "JOL" : "Joel", "AMO" : "Amos", "OBA" : "Obadiah", "JON" : "Jonah", "MIC" : "Micah", "NAM" : "Nahum", "HAB" : "Habakkuk", "ZEP" : "Zephaniah", "HAG" : "Haggai", "ZEC" : "Zechariah", "MAL" : "Malachi", "MAT" : "Matthew", "MRK" : "Mark", "LUK" : "Luke", "JHN" : "John", "ACT" : "Acts", "ROM" : "Romans", "1CO" : "1 Corinthians", "2CO" : "2 Corinthians", "GAL" : "Galatians", "EPH" : "Ephesians", "PHP" : "Philippians", "COL" : "Colossians", "1TH" : "1 Thessalonians", "2TH" : "2 Thessalonians", "1TI" : "1 Timothy", "2TI" : "2 Timothy", "TIT" : "Titus", "PHM" : "Philemon", "HEB" : "Hebrews", "JAS" : "James", "1PE" : "1 Peter", "2PE" : "2 Peter", "1JN" : "1 John", "2JN" : "2 John", "3JN" : "3 John", "JUD" : "Jude", "REV" : "Revelations"];

class Tabs extends Component {
  render() {
    return (
      <ul className="nav nav-tabs">
        {
          tabData.map(function(tab, i){
          return (
            <Tab 
              key={i} 
              data={tab} 
              isActive={this.props.activeTab === tab} 
              handleClick={this.props.changeTab.bind(this,tab)} 
            />
          );
        }.bind(this))
      }      
      </ul>
    );
  }
}

class Tab extends Component{
  render() {
    return (
      <li onClick={this.props.handleClick} className={this.props.isActive ? "active" : null}>
        <a href="#">{this.props.data.name}</a>
      </li>
    );
  }
}

class DownloadTokens extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      sourcelang:'',
      version: '',
      revision: '',
      targetlang:'',
      books: [],
      nbooks: [],
      uploaded:'Uploading',
      message: '',
      activeTab: tabData[0],
      activeTabValue: '',
      dataDisplay: 'Include Books',
      getVersions: [],
      getRevision: [],
      Targetlanguage: '',
      getTargetLangList: [''],
      Sourcelanguage: '',
      getAllBooks: '',
      getTargetLanguages: '',
      Tar: ''
    }

    // Upload file specific callback handlers
    this.onSelect = this.onSelect.bind(this);
    this.onSelectSource = this.onSelectSource.bind(this);
    this.onSelectTargetLanguage = this.onSelectTargetLanguage.bind(this);
    this.onSelectVersion = this.onSelectVersion.bind(this);
    this.onSelectRevision = this.onSelectRevision.bind(this);
    this.downloadTokenWords = this.downloadTokenWords.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(tab){
    this.setState({
      activeTab: tab,
      dataDisplay: tab.name
    });
  }

  componentDidMount = () => {
    this.selectedCheckboxes1 = new Set();
    this.selectedCheckboxes2 = new Set();

      var _this = this;
      let accessToken = JSON.parse(window.localStorage.getItem('access_token')) 
      $.ajax({
      url: GlobalURL["hostURL"]+"/v1/languagelist",
      contentType: "application/json; charset=utf-8",
      method : "GET",
      headers: {
                "Authorization": "bearer " + accessToken
      },
      success: function (result) {
        var getTargetLang = JSON.parse(result);
        _this.setState({getTargetLanguages: getTargetLang})
      },
      error: function (error) {
      }
    });

  }

  toggleCheckbox1 = label => {
    if (this.selectedCheckboxes1.has(label)) {
      this.selectedCheckboxes1.delete(label);
    } else {
      this.selectedCheckboxes1.add(label);
    }
  }

  toggleCheckbox2 = label => {
    if (this.selectedCheckboxes2.has(label)) {
      this.selectedCheckboxes2.delete(label);
    } else {
      this.selectedCheckboxes2.add(label);
    }
  }

//Create cheackbox for the Include Books
  createCheckboxes1 = (obj, books) => (
    Object.keys(books).map(function(v, i){
      return (
        <span key={i} className="disBook">
          <Checkbox
            label={booksName2[0][books[v]]}
            handleCheckboxChange={obj.toggleCheckbox1}
            bookCode={books[v]}
          />
        </span>
      );
    })
  )

//Create the checkbox for the Exclude Books
  createCheckboxes2 = (obj, books) => (
    Object.keys(books).map(function(v, i){
      return (
        <span key={i} className="disBook">
          <Checkbox
            label={booksName2[0][books[v]]}
            handleCheckboxChange={obj.toggleCheckbox2}
            bookCode={books[v]}
          />
        </span>
      );
    })
  )

  //onSelect for Target Language
  onSelect(e) {
    this.setState({ Targetlanguage: e.target.value });
  }
  

  //onSelectSource for Dynamic Versions
  onSelectSource(e) {
      this.setState({ Sourcelanguage: e.target.value });
      var _this = this;
      let accessToken = JSON.parse(window.localStorage.getItem('access_token')) 
      var data = { 
        "language": e.target.value
      }
      $.ajax({
        url: GlobalURL["hostURL"]+"/v1/version",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(data),
        method : "POST",
        headers: {
          "Authorization": "bearer " + accessToken
        },
        success: function (result) {
          var getVer = JSON.parse(result);
          _this.setState({getVersions: getVer.length > 0 ? getVer : []})
        },
        error: function (error) {
        }
      });
  }

  //onSelectVersion for Dynamic Revision
  onSelectVersion(e) {

      this.setState({ Version: e.target.value });
      var _this = this;
      let accessToken = JSON.parse(window.localStorage.getItem('access_token')) 
      var data = { 
        "language": this.state.Sourcelanguage, "version" : e.target.value
      }
      $.ajax({
        url: GlobalURL["hostURL"]+"/v1/revision",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(data),
        method : "POST",
        headers: {
          "Authorization": "bearer " + accessToken
        },
        success: function (result) {
          var getRev = JSON.parse(result);
          _this.setState({getRevision: getRev.length > 0 ? getRev : []})
        },
        error: function (error) {
        }
      });
  }

  //onSelectRevision for Dynamic list of the books
  onSelectRevision(e) {
      this.setState({ Revision: e.target.value });
      var _this = this;
      let accessToken = JSON.parse(window.localStorage.getItem('access_token')) 
      var data = { 
        "language": this.state.Sourcelanguage, "version": this.state.Version, "revision": e.target.value
      }
      $.ajax({
        url: GlobalURL["hostURL"]+"/v1/book",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(data),
        method : "POST",
        headers: {
          "Authorization": "bearer " + accessToken
        },
        success: function (result) {
          var getAllBook = JSON.parse(result);
          //for canonical sorting
          var booksCollection = [];
          for (var i = 0; i < BookArray.length; i++) {
          for( var j = 0; j < getAllBook.length; j++) {
              if(BookArray[i] === getAllBook[j]){
                booksCollection.push(getAllBook[j]);
              }
            }
          }
          _this.setState({getAllBooks: booksCollection.length > 0 ? booksCollection : []})
        },
        error: function (error) {
        }
      });
  }

  //onSelectTargetLanguage for Dynamic Target Language
  onSelectTargetLanguage(e){
      var _this = this;
      let accessToken = JSON.parse(window.localStorage.getItem('access_token')) 
      var data = { 
        "language": this.state.Sourcelanguage, "version": this.state.Version, "revision": e.target.value
      }
      $.ajax({
      url: GlobalURL["hostURL"]+"/v1/targetlang",
      contentType: "application/json; charset=utf-8",
      data : JSON.stringify(data),
      method : "POST",
      headers: {
        "Authorization": "bearer " + accessToken
      },
      success: function (result) {
        var getTargetLanguage = JSON.parse(result);
        _this.setState({getTargetLangList: getTargetLanguage.length > 0 ? getTargetLanguage : []})
      },
      error: function (error) {
      }
    });
  }

// For Downloads Token words
  downloadTokenWords(e){

    e.preventDefault();
    global.books = [];
    global.nbooks= [];

    // eslint-disable-next-line
    for (const books of this.selectedCheckboxes1) {
      global.books = Array.from(this.selectedCheckboxes1);

    }
  
    // eslint-disable-next-line
    for (const nbooks of this.selectedCheckboxes2) { 
      global.nbooks = Array.from(this.selectedCheckboxes2);
    }

    var _this = this

    // For file name changes
    var ListofLanguage = _this.state.getTargetLanguages;
    var FileNameSlanguage = '';
    if(ListofLanguage != null){
      Object.keys(ListofLanguage).map(function(data, index){
          if(ListofLanguage[data]  === _this.state.Sourcelanguage){
            FileNameSlanguage = data;
          }
        return null;
      })
    }

    var data = { 
        "sourcelang": this.state.Sourcelanguage, "version": this.state.Version, "revision": this.state.Revision , "targetlang": this.state.Targetlanguage, "nbooks":global.nbooks, "books": global.books 
    }
    console.log(data)
    let accessToken = JSON.parse(window.localStorage.getItem('access_token'))
    var bookCode = Array.from(this.selectedCheckboxes1);
    if(bookCode.length>1){
      var fileName = FileNameSlanguage + this.state.Version + booksName2[0][bookCode[0]] +'to'+ booksName2[0][bookCode[(bookCode.length)-1]]+'Tokens.xlsx';
    } else {
      fileName = FileNameSlanguage + this.state.Version + booksName2[0][bookCode[0]] +'Tokens.xlsx';
    }

    function beforeSend() {
      document.getElementById("loading").style.display = "inline";
    }

    function complete() {
      document.getElementById("loading").style.display = "none";
    }

    var xhr = new XMLHttpRequest();
    beforeSend();
    xhr.open('POST', GlobalURL["hostURL"]+"/v1/getbookwiseautotokens", true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Authorization', "bearer " + accessToken);
    xhr.onload = function(e) {
      complete();
      if (this.status === 200) {
        console.log(this.statusText)
        var blob = new Blob([this.response], {type: 'application/vnd.ms-excel'});
        var downloadUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
      } 
     if(this.status === 400){
      const blb    = new Blob([this.response], {type: "text/plain"});
      const reader = new FileReader();
      reader.addEventListener('loadend', (e) => {
        const text = e.srcElement.result;
        console.log(JSON.parse(text)["message"]);
        _this.setState({message: JSON.parse(text)["message"], uploaded: 'failure'})
        setTimeout(function(){
          _this.setState({uploaded: 'fail'})
        }, 5000);
      });
      reader.readAsText(blb);

      }
    };   
    xhr.send(JSON.stringify(data)); 
  }

  render() {
    return(
      <div>
      <div className="col-md-12">
        <Header/>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h3 className="top4">Download Tokens</h3>
          </div>
        </div>
        <div className="row top5 bodyColor bodyBorder alignCenter">
          <form className="col-md-12" encType="multipart/form-data">
            <div className={"alert " + (this.state.uploaded === 'success'? 'alert-success msg' : 'invisible')}>
              <strong>{this.state.message}</strong>
            </div>&nbsp;&nbsp;
            <div className={"alert " + (this.state.uploaded === 'failure'? 'alert-danger msg': 'invisible') }>
              <strong>{this.state.message}</strong>
            </div>&nbsp;&nbsp;
            <div className="form-inline col-md-12">
              <lable className="control-label"> <strong> Source Language </strong> </lable>
                <ListLanguages 
                  onChange={ this.onSelectSource}
                  Language={this.state.getTargetLanguages}
                />&nbsp;&nbsp;&nbsp;&nbsp;
              <lable className="control-lable"> <strong> Version </strong> </lable>
                <Versions 
                  version={this.state.getVersions} 
                  onChange={this.onSelectVersion} 
                />&nbsp;&nbsp;&nbsp;&nbsp;
              <lable className="control-lable"> <strong> Revision </strong> </lable>
                <RevisionNumber
                  revision={this.state.getRevision}  
                  onChange={ (e) => { this.onSelectRevision(e); this.onSelectTargetLanguage(e) } }
                />&nbsp;&nbsp;&nbsp;&nbsp;
              <lable className="control-label"> <strong> Target Language *</strong> </lable>
              <ListTargetLanguage
                Tar={this.state.getTargetLangList}
                Language={this.state.getTargetLanguages}
                onChange={this.onSelect}
              />
            </div>
            <div className="col-md-12">
            <section style={this.state.getAllBooks === '' ? {display:'none'} : {display: 'inline'} }>
             <Tabs activeTab={this.state.activeTab}  changeTab={this.handleClick}/>
              <section className="panel panel-success" style={this.state.dataDisplay === 'Exclude Books' ? {display:'none'} : {display: 'inline'} }>
                <h4 className="panel-heading">Include Books</h4>
                <div className="exclude1" >
                  {this.createCheckboxes1(this, this.state.getAllBooks)}
                </div>
              </section>
              <section className="panel panel-danger" style={this.state.dataDisplay === 'Include Books' ? {display:'none'} : {display: 'inline'} }>
                <h4 className="panel-heading">Exclude Books</h4>
                <div className="exclude1">
                   {this.createCheckboxes2(this, this.state.getAllBooks)}
                </div>
              </section>
              <div> * Optional field. Select <b>Target Language</b> to exclude the Translated Tokens.</div>
            </section>
            </div>
            <div className="form-group top10">
              <button id="btnGet" type="button" className="btn btn-success center-block" onClick={this.downloadTokenWords} disabled={!this.state.Revision} ><span className="glyphicon glyphicon-download-alt">&nbsp;</span>Download Tokens</button>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div id="loading" className="modal">
              <div className="center">
                <img alt="" src={require('./Images/loader.gif')} />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div>
        <Footer/>
      </div>
      </div>
    );
  }
}

export default DownloadTokens;