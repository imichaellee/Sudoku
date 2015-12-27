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
        $('<input>',{id:"sudokuSon"+i,maxlength:"1",absoluteIndex:'s'+i}).addClass('sudokuSon').appendTo($('#sudokuBody'));
        if( (GetRow(i) == 2) || (GetRow(i) == 5))
            $('#sudokuSon'+i).css("border-bottom","0px solid #FFFFFF");
        if( (GetCol(i) == 2) || (GetCol(i) == 5))
            $('#sudokuSon'+i).css("border-right","0px solid #FFFFFF");

        $('#sudokuSon'+i).keydown(function(event){
                
                
                if((event.which > 48 && event.which < 59) || (event.which > 96 && event.which < 105))
                {
                    var inputIs = event.which-48;
                    console.log('inputIs:'+inputIs);
                    
                    var index = (this.id).substring(9);
                     console.log('index:'+index);
                    if(checkRowColGridUnique(inputIs,index))
                        $('#isLegal').html('Perfect Try!'+inputIs);  //append is add after, html is likely replace
                    else
                        $('#isLegal').html('Good Try! But answer wrong!');     
                }
                else
                {     
                    $('#isLegal').html('illegal Press!'+event.which);     
                }
        });
        $('#sudokuSon'+i).keyup(function(event){

                    this.value=this.value.replace(/\D/g,'');
                   
             
        });
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




