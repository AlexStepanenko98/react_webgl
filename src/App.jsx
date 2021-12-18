import React from 'react';
import {init,draw,setMatrix} from './webgl.js';
import * as Const from './const.js';


export default class App extends React.Component{
	touches=[0,0]
	but=false;
	componentDidMount(){
		init(this.refs.canvas);
		draw();
	}
	touchStart=(e)=>{
		this.touches[0]=e.touches[0].clientX;
		this.touches[1]=e.touches[0].clientY;
		draw();
		alert(setMatrix(this.touches[0],this.touches[1]));
	}
	touchMove=(e)=>{
		draw();
	}
	touchEnd(){
		draw();
	}
	render(){
		return (
			<div>
				<canvas ref='canvas' width={window.innerWidth} height={window.innerHeight} onTouchStart={this.touchStart} onTouchMove={this.touchMove} onTouchEnd={this.touchEnd} />
			</div>
		)
	}
}
