var initSudokuBody = function(){
   
    
    $("#sudokuBody").css(
        {
            "position":"absolute",
            "margin":"0px",
            "paddiing":"0px",
 
            
            "top":function(){ return $(document).height()*0.5 - 225;},
            "left":function(){return $(document).width()*0.5 - 225;},
            "backgroud-color":"#8c8c8c",
            "border":"1px solid #4F4F4F",
            "height":"450px",
            "width":"450px",
        }
        ); 

    
    for(var i=0; i<81; i++){  //initial sudoku Son
        $('<input>',{id:"sudokuSon"+i}).addClass('sudokuSon').appendTo($('#sudokuBody'));
    }
    
    
   InitSudoku();
   showResult(); 
    
   }
   
   
   
   
var setValue=function(index,value){ //virtually set the value
      $("#sudokuSon"+index).val(value);
      $("#sudokuSon"+index).attr('disabled',true)
      
}


var showResult = function(){
    var Solution = new Array();
	for(var i=0; i<81; i++){
        //if(_NUM[i]>0){Solution[i] = "";}  
        //else{Solution[i] = -_NUM[i];}
		  Solution[i] = -_NUM[i];
            
            setValue(i,Solution[i]);
		//if(i%9==0) document.write("</br></br>");
		//document.write("&nbsp&nbsp&nbsp&nbsp&nbsp*"+Solution[i]);
	}
   
}

var getWindowResolution = function(){
    
}

var getDocumentResolution = function(){
    
}

