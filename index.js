const scavenger = require('scavenger');
var color = require('colors');
var request = require('request');
var cheerio = require('cheerio');
var tanya = require('inquirer');
var _ = require('lodash');
var fs = require('fs');


var askWeb = [
  {
    type: 'input',
    name: 'website',
    message: 'Website apa yang mau dikorek?',
  },
  {
    type: 'input',
    name: 'variables',
    message: 'Berapa jumlah variabel yang akan dikorek?'
  },
];


console.log('\n');
console.log(color.white('###############################################################'));
console.log(color.white(':::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'));
console.log(color.white("'##::: ##::'######::::'#######::'########::'########:'##:::'##:"));
console.log(color.white(":###:: ##:'##... ##::'##.... ##: ##.... ##: ##.....:: ##::'##::"));
console.log(color.white(":## ## ##: ##::'####: ##:::: ##: ########:: ######::: #####::::"))
console.log(color.white(":##:. ###: ##::: ##:: ##:::: ##: ##::. ##:: ##::::::: ##:. ##::"));
console.log(color.white(":##::. ##:. ######:::. #######:: ##:::. ##: ########: ##::. ##:"));
console.log(color.white("..::::..:::......:::::.......:::..:::::..::........::..::::..::"));
console.log(color.white(':::::::::::::::::::') + color.green('Credit: Deden Bangkit')+ color.white(':::::::::::::::::::'));
console.log(color.white('###############################################################'));
console.log('\n');


//Mulai Pertanyaan
function createArray()
{
    tanya.prompt(askWeb).then(function (jawab) {
      createQuestion(jawab.website, jawab.variables);
    });
}

function createQuestion(wb,vr)
{
    let pertanyaan = [];
    for (var i=0; i<vr; i++){
      pertanyaan.push(
        {
          type: 'input',
          name: 'key'+i,
          message: 'Apa nama key object ke-'+i+'?',
        },
        {
          type: 'input',
          name: 'class'+i,
          message: 'Apa nama class ke-'+i+' yang akan dikorek',
        },
        {
          type: 'list',
          name: 'tipe'+i,
          message: 'Apakah data yang anda butuhkan?',
          choices: ['Teks', 'Link', 'Gambar'],
          filter: function (val) {
            return val.toLowerCase();
          }
        }
      )
    }
    newQuestion(wb, vr, pertanyaan)
}

function newQuestion(wb, vr, qs){
  tanya.prompt(qs).then(function(result){
    scavenger.scrape(wb).then((html) => {
      let $ = null;
      var daftar = [];
      var raw = [];
      var data = [];
      $ = cheerio.load(html);
        for (var i=0; i<vr; i++){
          var objek = result['key'+i];
          $(result['class'+i]).each( function(i, element) {
            if(result['tipe'+i] === 'gambar'){
              let daf = $(this).attr("src");
              daftar.push({[objek]:daf});
            }else if(result['tipe'+i] ==='link'){
              let daf = $(this).attr("href");
              daftar.push({[objek]:daf});
            }else{
              let daf = $(this).text();
              daftar.push({[objek]:daf});
            }
          });
        };
      var total = daftar.length;

      for(var b=0; b<vr; b++){
        var hasil = [];
        for (var a=0; a<total; a++){
          if (result['key'+b] in daftar[a]){
            hasil.push(daftar[a][result['key'+b]])
          }
        }
        raw.push(hasil);
      };

      for (var c=0; c<total/vr; c++){
        var split = [];
        for (var d=0; d<vr; d++){
          var splitter = {[result['key'+d]]:raw[d][c]};
          split.push(splitter);
        }
        data[c] = _.assign.apply(_, _.merge(split));
      }
      console.dir(_.flattenDeep(data), {depth:null,colors:true});
      // console.log(JSON.stringify(data));
      });
    })
};



createArray();
