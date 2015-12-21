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

    
    for(var i=0; i<81; i++){
        $('<input>',{id:"sudokuSon"+i}).addClass('sudokuSon').appendTo($('#sudokuBody'));
        
        if(i%9===4)
            setValue(i,i+1);
    }
    
    
  
    
    
   }
   
   
   
   
var setValue=function(index,value){
      $("#sudokuSon"+index).val(value);
      $("#sudokuSon"+index).attr('disabled',true)
      
}


var getWindowResolution = function(){
    
}

var getDocumentResolution = function(){
    
}

