	

	var _NUM = new Array;
	var _V = new Array;
	var StackOfNum = new Array();
	var StackOfMinCell = new Array();

var InitSudoku = function(){
	
	/*V（0）=0000000012=1 V（1）=0000000102=2 V（2）=0000001002=4*/
	console.log('Initiating...');
	_V[0]=1;
	for(var i=1; i<9; i++){
		_V[i] = _V[i-1]*2;
	}
	_V[9]=511;
	
	for(var i=0; i<81; i++){
		_NUM[i] = _V[9];
	}
	console.log('Setting Num...');
	SetLine(0,[7, , , , , , , , ]);
    SetLine(1,[ , ,2,5, , , , , ]); 
    SetLine(2,[ ,6, , ,8, , ,1, ]);  
    SetLine(3,[ ,4, , , ,6, , , ]); 
    SetLine(4,[ , , , ,3,4,6, , ]);
    SetLine(5,[ , , ,0, , , ,2, ]);
    SetLine(6,[ , ,0, , , , ,5,7]); 
    SetLine(7,[ , ,7,4, , , ,0, ]);
    SetLine(8,[ ,8, , , , ,3, , ]);

	//Calculate();
}

var OutputTest = function(){
	for(var i=0; i<81; i++){
		if(i%9 == 0)
		console.log(" #"+_NUM[i]+" #"+_NUM[i+1]+" #"+_NUM[i+2]+" #"+_NUM[i+3]+" #"+_NUM[i+4]+" #"+_NUM[i+5]+" #"+_NUM[i+6]+" #"+_NUM[i+7]+" #"+_NUM[i+8]);
	}

}



var Get1Count = function(Value){
	var counter = 0;
	
	do{
		Value = Value & (Value-1);
		counter += 1;
	}while(Value>0)
	
	return counter;
}


var GetRow = function(Index){  //to change index (0-80) into xy format (0-9)	
	return Math.floor(Index/9);
}


var GetCol = function(Index){  //to change index (0-80) into xy format (0-9)
	return Index%9;
}

var GetIndexOfNum = function(Num,Index){ //Num here is 10101001..Index is start from 0
	var Counter = 0;
	for(var i=0; i<9; i++){
		if( (_V[i] & Num)!=0) {
			Counter+=1;
			if( Counter == Index ) return i;
		}
	}
	return -3;
}


var RestoreNum = function(){
	if(StackOfNum.length != 81) return -4;
	for(var i=0; i<81; i++){
		_NUM[i] = StackOfNum[i];
	}
	
}


var RemoveNum = function(Index,Num){
	//var Index = Row*9+Col;
	
	var NumReverse = _V[9]-_V[Num];
	if(_NUM[Index]>0)
	{
		_NUM[Index] = _NUM[Index] & NumReverse; 
	}

	return _NUM[Index];
}



var SetNum = function(Index,Num){ //Num is real num miners one,ps this three varialbes all begin from 0,which is only used in internal function

	var Row = GetRow(Index);
	var Col = GetCol(Index);
	
  
    
	if(( _V[Num] & _NUM[Index])  == 0 ) //check if the target num already cannot be chosen
		return false;
	_NUM[Row*9+Col] = -(Num+1);
	
	//Num = _V[9]-_V[Num];    //this row should be added in original version from web ,because reverse num has already generated before call remove function
	for(var i=0; i<9; i++){ //remove the target num in each row and column
		if( RemoveNum(i*9+Col,Num) == 0 ) return false;
		//console.log('RemoveCol'+ Col);
		if( RemoveNum(Row*9+i,Num) == 0 ) return false;
		//console.log('RemoveRow'+ Row);
	}
		
	var Grid_Row = Math.floor( (Row)/3 ) * 3; //Grid row is absolute-position row of the 1st one cell of grid
	var Grid_Col = Math.floor( (Col)/3 ) * 3;
	var Grid_Ini_Index = Grid_Row * 9 + Grid_Col;
	
	for(var i=0; i<9 ; i++){  
			if( RemoveNum(Grid_Ini_Index,Num) == 0) return false;
	
		Grid_Ini_Index+=1;  //the core of position change in one grid
		if( i==2 || i==5 ) { Grid_Ini_Index+=6; }
	}
	return true; //finish set
}

var SetLine = function(_Row,_RowSet){
	var RowSet = new Array();
	var Row = 0;
	Row = _Row;
	RowSet = _RowSet;
	if(RowSet.length == 0){return false;}

	for(var i=Row*9; i<Row*9+9; i++){
        SetNum(i,RowSet[i%9]);
        if(RowSet[i%9]>=0 && RowSet[i%9]<=9)
            $('#sudokuSon'+i).css("background-color","#6f6f6f");
		
	}
}

var Calculate = function(){
	
	var Index_Fish = 0;
	var Index_MinCell = -1;
	Index_MinCell =  FindMinCell();
	
	do {
        console.log(Index_MinCell+"**start***");
		//OutputTest();
		if ( Index_MinCell == -2 ){
			if(StackOfMinCell.length == 0) {
				//console.log('error! No cache!');
				return false;
			}
			//console.log('....before..Numstack:'+ StackOfNum.length +'mincelstack'+ StackOfMinCell.length);
			//console.log('....Before VAR..Numstack:'+ StackOfNum.length +'mincelstack'+ StackOfMinCell.length);
			StackOfNum = new Array();  //clear cache
			//console.log('....After VAR..Numstack:'+ StackOfNum.length +'mincelstack'+ StackOfMinCell.length);
			StackOfNum=StackOfMinCell.pop();  
			
			Index_Fish = StackOfNum[82] + 1;
			StackOfNum.splice(82,1);
			
			Index_MinCell = StackOfNum[81];
			StackOfNum.splice(81,1);
			//console.log('.....after..Numstack:'+ StackOfNum.length +'mincelstack'+ StackOfMinCell.length);		
			//console.log('Stack Pop'+StackOfMinCell.length);

			if( RestoreNum()==-4 ) console.log('What?!!!!!!!!!!!!!!!!!!!!!!Numstack:'+ StackOfNum.length +'mincelstack'+ StackOfMinCell.length);    //restore according to the cache,here NUM array has been changed
			
			Index_MinCell = TryNextFish(Index_MinCell,Index_Fish);
            console.log(Index_MinCell+"***firsrLOOP**");
			//OutputTest();
		}
		else{
			//console.log('....Before VAR..Numstack:'+ StackOfNum.length +'mincelstack'+ StackOfMinCell.length);
			StackOfNum = new Array();  //clear cache
			//console.log('....After VAR..Numstack:'+ StackOfNum.length +'mincelstack'+ StackOfMinCell.length);
	for(var i=0; i<81; i++){
		StackOfNum[i]=_NUM[i];
	}
		//	StackOfNum=_NUM;  //record before setting
			//console.log('.....record before setting........Numstack:'+ StackOfNum.length +'mincelstack'+ StackOfMinCell.length+'_NUM:'+_NUM.length);
			console.log(Index_MinCell+"***beforeLOOP**");
           // OutputTest();
                Index_MinCell = TryNextFish(Index_MinCell,1);
            console.log(Index_MinCell+"***afterLOOP**");
          //  OutputTest();
		}
        //console.log(Index_MinCell+"***after**");
		//OutputTest();
    } while ( Index_MinCell != -1 );
	
	//console.log('calculate complete!');

    showResult(); 
	//console.log('Calculation Complete!');
	//return Solution;
}




var FindMinCell = function(){  //the _NUM :one kind is 000010101,000000001 second is 00000000, third is -8
	var Counter = 0;
	var Index_Current = 0;
	var Index_MinCell = -1;
	var MinCount = 100;
	
	do{
		if( _NUM[Index_Current]>0 ){
			Counter = Get1Count(_NUM[Index_Current]);
			
			if( Counter==1 ) {  //if the possible num just one,it mEANs it can be inserted ,then set it ,then back to the first cell cuz the possible num of one cell could change after set one another cell
				var HelpInsert = GetIndexOfNum(_NUM[Index_Current],1);
				if( SetNum(Index_Current,HelpInsert) == false ){return -2;}
				else{Index_Current=-1; MinCount = 100;}
					 
				
				//if( Index_Current==Index_MinCell){ //reset the setting after solve one single cell
				//	Index_MinCell=-1;
				//	MinCount = 100;
				//}
			}
			else if( Counter<MinCount ){
				MinCount = Counter;
				Index_MinCell = Index_Current;
			}
			
		}	
		Index_Current++;
		//console.log('FindCell ：：'+Index_Current);
	}while( Index_Current<81 )
	//console.log('FindMinCell Complete! isssssss'+Index_MinCell);
	return Index_MinCell;
	
}


var TryNextFish = function(Index_MinCell,NextFish){
	

	
	var NextTry = GetIndexOfNum(_NUM[Index_MinCell],NextFish);  //try other num start from 1
	//console.log('NextTry:'+NextTry+'----Index_MinCell'+Index_MinCell+'----NextFish:'+NextFish);
	//console.log('What?!Numstack:'+ StackOfNum.length +'mincelstack'+ StackOfMinCell.length);
   OutputTest();
    console.log(Index_MinCell+"***beforeTRY**"+NextTry);
    if( _NUM[Index_MinCell]<0 )
    return -1;
	do {      //try fishlist in prepared mincell
		if( SetNum(Index_MinCell,NextTry) == true){
            
            OutputTest();
            console.log(Index_MinCell+"***afterTRy**"+NextTry);
			//console.log('Stack Push!');
			//console.log('RightFish............Next fish!'+ NextFish + 'NextTry' + NextTry +'Index_MinCell'+Index_MinCell);
					//console.log('*********Trying........Numstack:'+ StackOfNum.length +'mincelstack'+ StackOfMinCell.length+'_NUM:'+_NUM.length);
			StackOfNum.push(Index_MinCell);  //record the mincell and the index of maybe-ok fish to the last positon of Ltemp
			StackOfNum.push(NextFish);
			
			//for(var i=0;i<Ltemp.length;i++){
			//console.log(Ltemp.pop()+"**");
			//}
			StackOfMinCell.push(StackOfNum);
						//console.log('******************...Tried........Numstack:'+ StackOfNum.length +'mincelstack'+ StackOfMinCell.length+'_NUM:'+_NUM.length);
			Index_MinCell = FindMinCell();
			return Index_MinCell;
		}
		else{
		//RestoreNum(L);
		//console.log('Next fish!'+ NextFish);
		NextFish++;
		//console.log('Stack  NOT !!Push!');
		NextTry = GetIndexOfNum(_NUM[Index_MinCell],NextFish);
		}
		//console.log('Next Round!......Next fish!'+ NextFish + 'NextTry' + NextTry + 'Index_MinCell' + Index_MinCell);
	} while (NextTry != -3);
	
	if( NextTry == -3 ){ //fishlist all not work
	//console.log('No fish!');
		return -2;
	}
	//console.log('FindNextFish Complete!');
	
	
}

var checkRowColGridUnique = function(test,index){ // check whether the input is unique in R C G  
	 console.log("Same1");
    var row_i = GetRow(index);
	var col_i = GetCol(index);
	var Grid_Row = Math.floor( (row_i)/3 ) * 3; //Grid row is absolute-position row of the 1st one cell of grid
	var Grid_Col = Math.floor( (col_i)/3 ) * 3;
	var grid_i = Grid_Row * 9 + Grid_Col;       
    var flag = false;
 
            for(var row_i_each = row_i*9; row_i_each<row_i*9+9; row_i_each++){ //different col in one row
                if(test != -_NUM[row_i_each]){flag=true;console.log('Diff'+'with'+_NUM[row_i_each]);}
                else{flag=false;console.log("Same1");return flag;}    
            }      
        
        

            for(var col_i_each = col_i; col_i_each<col_i+73; col_i_each+=9){ //different col in one row
                if(test != -_NUM[col_i_each]){flag=true;console.log('Diff'+'with'+_NUM[col_i_each]);}
                else{flag=false;console.log('Same2');return flag;}    
            } 
               
            //check each grid        
            
            for(var grid_i_each = grid_i; grid_i_each<grid_i+21; grid_i_each++){ //different col in one row
                if(test != -_NUM[grid_i_each]){flag=true;console.log('Diff'+'with'+_NUM[grid_i_each]);}
                else{flag=false;console.log('Same3');return flag;}  
                if(grid_i_each==(grid_i+2) || grid_i_each==(grid_i+5)){grid_i_each+=6;}  
            } 
                      
        return flag;  
}


//checkfinal only can check each row and col and grid have contain the 1-9 not check the unique 
var checkFinal = function(){  //(ONLY final check)check whether input is completely and indivually contain 1 to 9
    //console.log('counter1111!');
    var counter = 0;
    var flag =true;
   
    for(var row_i=2; row_i<3; row_i++){
         var ToBeTest = new Array;
            //check each row
            for(var row_i_each = row_i*9; row_i_each<row_i*9+9; row_i_each++){
                ToBeTest[row_i_each%9] = -_NUM[row_i_each];
                console.log('!!!done!!!ToBeTest'+row_i_each%9+'='+ToBeTest[row_i_each%9]);
                //console.log('counterxxxxxxxxxxx!'+row_i_each%9+_NUM[row_i_each]);
                }       
    // should have been a distinguish function,but doesn work if transporting var needed In JS MAYBE {check each 1-9 funcion}
              counter = 0;
                for(var i=0;i<9;i++){
                if(ToBeTest.indexOf(i+1)>=0){counter++;}
            }
            if(counter == 9){ 
                //console.log('ToBeTest.indexOf(i+1)!'+ToBeTest.indexOf(i+1));
                flag = true;
            } 
            else{
                flag = false;
                }
     // should have been a distinguish function      
        
    }
        for(var col_i=2; col_i<3; col_i++){
         var ColToBeTest = new Array;
          var ColIndex = 0;
            //check each col
            for(var col_i_each = col_i; col_i_each<col_i+73; col_i_each+=9){
                ColToBeTest[ColIndex] = -_NUM[col_i_each];
                ColIndex++;
                }
    // should have been a distinguish function,but doesn work if transporting var needed In JS MAYBE {check each 1-9 funcion}
              counter = 0;
                for(var i=0;i<9;i++){
                if(ColToBeTest.indexOf(i+1)>=0){counter++;}
            }
            if(counter == 9){ 
                flag = true;
            } 
            else{
                flag = false;
                }
       }              
        for(var grid_i=0; grid_i<1; grid_i++){
         var GridToBeTest = new Array;
          var GridIndex = 0;
          var GridStart = 1;
            //check each grid        
            if( (grid_i == 3) || (grid_i == 6) ){GridStart=4;}
            else{GridStart = 1;}      
            var grid_start_i_index = grid_i*3*GridStart;
            
            for(var grid_i_each = grid_start_i_index; grid_i_each<grid_start_i_index+21; grid_i_each++){
              
                GridToBeTest[GridIndex] = -_NUM[grid_i_each];
                GridIndex++;
                if(grid_i_each - grid_start_i_index == 2 || grid_i_each - grid_start_i_index == 5){grid_i_each+=6;}
                
                }
            
    // should have been a distinguish function,but doesn work if transporting var needed In JS MAYBE {check each 1-9 funcion}
              counter = 0;
                for(var i=0;i<9;i++){
                if(GridToBeTest.indexOf(i+1)>=0){counter++;}
            }
            if(counter == 9){ 
                                 flag = true;
                            } 
            else{
                    flag = false;
                }                
                
                
                
                
     // should have been a distinguish function      
        
    }
    
    return flag;
    
}
