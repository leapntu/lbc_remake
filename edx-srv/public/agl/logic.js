
var canvas
var stage
var stimuli
var train_start
var test_start
var test_items
var test_index
var test_end
var dataSet = []
var mode = 'none'
var font_info = "20px Times"

function getMS() {
  time = window.performance.now()
  return time
}

function randomize(array){
    var i = array.length, j, temp;
    while ( --i ){
        j = Math.floor( Math.random() * (i - 1) );
        temp = array[i]
        array[i] = array[j]
        array[j] = temp;
    }
}

function init(){
    canvas = document.getElementById('canvas')
    stage = new createjs.Stage(canvas)
    preload()
}

function preload(){
  createjs.Sound.alternateExtensions = ["mp3"]
  createjs.Sound.registerSound({id:"train", src:"./audio/Segment.3minTrain.mp3"})
  createjs.Sound.registerSound({id:"bk1_fw1", src:"./audio/bk1_fw1.mp3"})
  createjs.Sound.registerSound({id:"bk2_fw2", src:"./audio/bk2_fw2.mp3"})
  createjs.Sound.registerSound({id:"bk3_fw3", src:"./audio/bk3_fw3.mp3"})
  createjs.Sound.registerSound({id:"bk4_fw4", src:"./audio/bk4_fw4.mp3"})
  createjs.Sound.registerSound({id:"bk5_fw5", src:"./audio/bk5_fw5.mp3"})
  createjs.Sound.registerSound({id:"bk6_fw6", src:"./audio/bk6_fw6.mp3"})
  createjs.Sound.registerSound({id:"fw1_bk1", src:"./audio/fw1_bk1.mp3"})
  createjs.Sound.registerSound({id:"fw2_bk2", src:"./audio/fw2_bk2.mp3"})
  createjs.Sound.registerSound({id:"fw3_bk3", src:"./audio/fw3_bk3.mp3"})
  createjs.Sound.registerSound({id:"fw4_bk4", src:"./audio/fw4_bk4.mp3"})
  createjs.Sound.registerSound({id:"fw5_bk5", src:"./audio/fw5_bk5.mp3"})
  createjs.Sound.registerSound({id:"fw6_bk6", src:"./audio/fw6_bk6.mp3"})
  genStims()
}

function genStims() {
  test_items = ["bk1_fw1", "bk2_fw2", "bk3_fw3", "bk4_fw4", "bk5_fw5", "bk6_fw6", "fw1_bk1", "fw2_bk2", "fw3_bk3", "fw4_bk4", "fw5_bk5", "fw6_bk6"]
  test_end = test_items.length
  randomize(test_items)
  startTicker()
}

function startTicker(){
  createjs.Ticker.addEventListener("tick", runTask)
  createjs.Ticker.framerate = 1000
  instructTrain()
}

function instructTrain(){
  stage.removeAllChildren(); stage.update();
  var text = new createjs.Text("You will listen to a novel language. Words will be played in rapid sequence for about 3 minutes.\nYour task is to listen attentively to this language.\nAfter this task you will also be asked to express your preference about what words go together well in the language you have heard.\nThis task lasts no more than 6 minutes altogether.\nPress the space key to continue when ready.", font_info)
  text.x = 10
  text.y = 200
  stage.addChild(text)
  stage.update()
  mode = "instruct_train"
}

function instructTest(){
  stage.removeAllChildren(); stage.update();
  var text = new createjs.Text("You will now hear phrases from the language you have just heard.\nAt each presentation, your task is to decide whether the first or the second phrase comes from the language you have just heard.\nIf you are unsure, base your preference on your intuition.\nPress the space key to continue when ready.", font_info)
  text.x = 10
  text.y = 200
  stage.addChild(text)
  stage.update()
  mode = "instruct_test"
}

function ask(){
  stage.removeAllChildren(); stage.update();
  var text = new createjs.Text("Which phrase is more likely to belong to the language you've just heard?\n\nPress 1 for the first, or 2 for the second.", font_info)
  text.x = 10
  text.y = 200
  stage.addChild(text)
  stage.update()
  mode = "ask"
}

function end(){
  mode = 'none'
  var text = new createjs.Text("Thank you for participating!\n\nThe aim of this study is to better understand human learning and perception.\nIn particular, how people may learn languages when words are presented in rapid order.\nThis research informs us of what type of relations are easier to pick up,\nand may help in devising better methods for language teaching.\n\nFor more information, you may contact the experimenter at leap@ntu.edu.sg", font_info)
  text.x = 10
  text.y = 200
  stage.addChild(text)
  stage.update()
  postData()
}

function startTrain(){
  stage.removeAllChildren()
  stage.update()
  train_start = getMS()
  stimuli = createjs.Sound.play("train")
  mode = "training"
}

function startTest(){
  test_index = 0
  stage.removeAllChildren()
  stage.update()
  stimuli = createjs.Sound.play(test_items[test_index])
  test_start = getMS()
  mode = 'testing'
}

function handleTest(){
  stage.removeAllChildren()
  stage.update()
  if(test_index < test_end){
    stimuli = createjs.Sound.play(test_items[test_index])
    test_start = getMS()
    mode = "testing"
  }

  if(test_index >= test_end){
    end()
  }
}

function runTask(event){
  if(mode == 'training'){
    if(stimuli.playState == "playFinished"){
      mode = "none"
      instructTest()
    }
  }

  if(mode == 'testing'){
    if(stimuli.playState == "playFinished"){
      mode = 'none'
      ask()
    }
  }

}

document.addEventListener("keydown", handleKey)
function handleKey(event){
  if(mode == 'ask'){
    if(event.key == "1" || event.key == "2"){
      mode = 'none'
      file = stimuli.src
      dataSet.push( {"file": file, "choice": event.key, "rt":getMS() - test_start} )
      test_index += 1
      handleTest()
    }
  }

  if(mode == 'instruct_train'){
    if(event.key == " "){
      mode = 'none'
      startTrain()
    }
  }

  if(mode == 'instruct_test'){
    if(event.key == " "){
      mode = 'none'
      startTest()
    }
  }

}

function postData(){
  var finalData = {subject_id: localStorage.LEAP_subject_id, data: dataSet}
  socket.emit('writeAglData', finalData, function(responded){
    console.log("Data Saved");
  })
}

// Taken from: Short guide to stimulus presentation.txt
// # 21/05/2015 updated 23/06/2016
// # Author: Luca
//
//
// # For backward bias training test items are:
//
// can be labelelled as FreqLast or HILO
// "AX","AY","DY","DZ","GX","GZ",
//
// label FreqFirst or LOHI
// "XB","XC","YE","YF","ZH","ZI"
//
// To create Forced-choice test pairs (e.g., BX vs XA) do an exaustive combination of all HILO with LOHI items. I’ve done this already in the file backward_test_pairs_symbols.txt
//
//
//
// For forward bias training test items are:
//
// label FreqLast and HILO
// "BX","CX","EY","FY","HZ","IZ"
//
// label FreqFirst and LOHI
// "XA","XD","YD","YG","ZA","ZG"
//
// To create Forced-choice test pairs (e.g., BX vs XA) do an exaustive combination of all HILO with LOHI items. I’ve done this already in the file forward_test_pairs_symbols.txt
