	

	var _NUM = new Array;
	var _V = new Array;


var InitSudoku = function(){

	/*----
	
V（0）=0000000012=1 V（1）=0000000102=2 V（2）=0000001002=4 V（3）=0000010002=8 V（4）=0000100002=16 V（5）=0001000002=32 V（6）=0010000002=64
	
	----*/
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
	SetLine(7,[0,1,2,3,4,5,6,7,8]); 

 
	//console.log('Calculating...');
	Calculate();
}

var OutputTest = function(){
	for(var i=0; i<81; i++){
		console.log("#"+_NUM[i]);
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

var GetIndexOfNum = function(Num,Index){ //Num here is 10101001..
	var Counter = 0;
	for(var i=0; i<9; i++){
		if( (_V[i] & Num)!=0) {
			Counter+=1;
			if( Counter == Index ) return i;
		}
	}
}


var RestoreNum = function(L){
	var Ltemp = new Array();
	Ltemp = L;
	for(var i=0; i<81; i++){
		_NUM[i] = Ltemp[i];
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
	console.log('test0');	
	if(( _V[Num] & _NUM[Index] ) == 0) //check if the target num already cannot be chosen
		return false;
	_NUM[Row*9+Col] = -(Num+1);
	
	//Num = _V[9]-_V[Num];    //this row should be added in original version from web ,because reverse num has already generated before call remove function
	console.log('test');
	for(var i=0; i<9; i++){ //remove the target num in each row and column
		if( RemoveNum(i*9+Col,Num) == 0 ) return false;
		console.log('RemoveCol'+ Col +Row);
		if( RemoveNum(Row*9+i,Num) == 0 ) return false;
		console.log('RemoveRow'+ Row);
	}
		
	var Grid_Row = Math.floor( (Row)/3 ) * 3; //Grid row is absolute-position row of the 1st one cell of grid
	var Grid_Col = Math.floor( (Col)/3 ) * 3;
	var Grid_Ini_Index = Grid_Row * 9 + Grid_Col;
	
	for(var i=0; i<9 ; i++){  
		console.log('RemoveGrid');
			if( RemoveNum(Grid_Ini_Index,Num) == 0) return false;
			console.log('Grid_Ini_Index:::::'+ i);
			
		Grid_Ini_Index+=1;  //the core of position change in one grid
		if(i==2 || i==5) {Grid_Ini_Index+=6;}
	}
}

var SetLine = function(_Row,_RowSet){
	var RowSet = new Array();
	var Row = 0;
	Row = _Row;
	RowSet = _RowSet;
	if(RowSet.length == 0){return false;}

	for(var i=Row*9; i<Row*9+9; i++){
		SetNum(i,RowSet[i%9]);
	}
}

var Calculate = function(){
	
	var Index_Fish = 0;
	var Index_MinCell = -1;
	var Q = new Array();
	var L = new Array();
	Index_MinCell =  FindMinCell();
	
	do {
		if ( Index_MinCell == -2 ){
			if(Q.length == 0) {
				console.log('error! No cache!');
				return false;
			}
			
			L = Q.pop;
			
			Index_Fish = L[82] + 1;
			L.splice(82,1);
			
			Index_MinCell = L[81];
			L.splice(81,1);
					
			console.log('Stack Pop'+Q.length);

			RestoreNum(L);
			
			Index_MinCell = TryNextFish(Q,L,Index_MinCell,Index_Fish);
			
		}
		else{
			L = new Array();
			L = _NUM;
			Index_MinCell = TryNextFish(Q,L,Index_MinCell,0);
		}
	} while ( Index_MinCell != -1 );
	
	console.log('calculate complete!');

	var Solution = new Array();
	for(var i=0; i<81; i++){
		Solution[i] = -_NUM[i];
		console.log(Solution[i]);
	}
	
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
				if( SetNum(Index_Current,_NUM[Index_Current]) == false ){return -2;}
				Index_Current=-1;  
				
				if( Index_Current==Index_MinCell){ //reset the setting after solve one single cell
					Index_MinCell=-1;
					MinCount = 100;
				}
			}
			else if( Counter<MinCount ){
				MinCount = Counter;
				Index_MinCell = Index_Current;
			}
			
		}	
		Index_Current++;
	}while( Index_Current<80 )
	return Index_MinCell;
}


var TryNextFish = function(Q,L,Index_MinCell,NextFish){
	
	var Qtemp = new Array();
	var Ltemp = new Array();
		Qtemp = Q;
		Ltemp = L;
	
	var NextTry = GetIndexOfNum(_NUM[Index_MinCell],NextFish);
	do {
		if( SetNum(Index_MinCell,_V[NextTry]) == true){
			console.log('Stack push!');
			Ltemp.push(NextFish);
			Ltemp.push(Index_MinCell);
			Qtemp.push(L);
			Index_MinCell = FindMinCell();
		}
		else{
		RestoreNum(L);
		NextFish+=1;
		NextTry = GetIndexOfNum(_NUM[Index_MinCell],NextFish);
		}
	} while (NextTry != -1 );
	
	if( NextTry == -1 ){
		Index_MinCell = -2;
	}
	
	return Index_MinCell;
	
}


var GetNumString = function(Num){
	if(Num<0) return "#"+Num;
	var S = new Array();
	var NumTemp = 0;
	for(var i=0; i<9; i++){
		if(_V[i] & Num != 0){
			S.push(i);
		}
	}
	return S;
}