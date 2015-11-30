var _NUM = new Array;
var _V = new Array;


var initSudoku = function(){
	
	
	/*----
	
V（0）=0000000012=1

V（1）=0000000102=2

V（2）=0000001002=4

V（3）=0000010002=8

V（4）=0000100002=16

V（5）=0001000002=32

V（6）=0010000002=64

V（7）=0100000002=128

V（8）=1000000002=256

V（9）=1111111112=511
	
	----*/
	
	_V[0]=1;
	for(var i=1; i<9; i++){
		_V[i] = _V[i-1]*2;
	}
	_V[9]=511;
	
	for(var i=0; i<80; i++){
		_NUM = _V[9];
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

var RemoveNum = function(Row,Col,Num){
	var Index = Row*9+Col;
	var NumReverse = _V[9]-Num;
	if(_NUM[Index]>0)
	{
		_NUM[Index] = _NUM[Index] & NumReverse;
	}
	return _NUM[Index];
}

var SetNum = function(Row,Col,Num){ //Num is real num miners one,ps this three varialbes all begin from 0,which is only used in internal function

	var Index = Row*9+Col;
	if(( _V[Num] & _NUM[Index] ) == 0) //check if the target num already cannot be chosen
		return false;
	_NUM[Row*9+Col] = -(Num+1);
	
	//Num = _V[9]-_V[Num];    //this row should be added in original version from web ,because reverse num has already generated before call remove function
	
	for(var i=0; i<9; i++){ //remove the target num in each row and column
		if( RemoveNum(i,Col,Num) == 0 ) return false;
		if( RemoveNum(Row,i,Num) == 0 )	return false;
	}
	
	var Grid_X = Math.floor( (Row)/3 ) * 3; //remove the target num in every grid
	var Grid_Y = Math.floor( (Col)/3 ) * 3;
	
	for(var i=Grid_X; i<Grid_X+3 ; i++){  
		for(var j=Grid_Y; j<Grid_Y+3; j++){
			if( RemoveNum(i,j,Num) == 0) return false;
		}
	}

}

var IndexToXY = function(Index){  //to change index (0-80) into xy format (0-9)
	
	var xPos = Math.floor(Index/9);
	var yPos = Index%9;
	
}