var initSudokuBody = function(){
   
    
    $("#sudokuBody").css(
        {
            "position":"absolute",
            "margin":"0px",
            "paddiing":"0px",
 
            
            "top":function(){ return $(document).height()*0.5 - 225;},
            "left":function(){return $(document).width()*0.5 - 225;},
            "backgroud-color":"#8c8c8c",
            "border":"0px solid #4F4F4F",
            "height":"450px",
            "width":"468px",
        }
        ); 

    
    for(var i=0; i<81; i++){  //initial sudoku Son
        $('<input>',{id:"sudokuSon"+i}).addClass('sudokuSon').appendTo($('#sudokuBody'));
        if( (GetRow(i) == 2) || (GetRow(i) == 5))
            $('#sudokuSon'+i).css("border-bottom","0px solid #FFFFFF");
        if( (GetCol(i) == 2) || (GetCol(i) == 5))
            $('#sudokuSon'+i).css("border-right","0px solid #FFFFFF");

        
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
        if(_NUM[i]>0){Solution[i] = "";}  
        else{Solution[i] = -_NUM[i];setValue(i,Solution[i]);}
		  
            
            
		//if(i%9==0) document.write("</br></br>");
		//document.write("&nbsp&nbsp&nbsp&nbsp&nbsp*"+Solution[i]);
	}
   
}


