import * as Const from './const.js';


let gl;
let matrix;
let position;
let color;
let mat;


const vertex=`attribute vec2 position;
attribute vec3 color;
varying vec3 color_;
uniform mat3 matrix;


void main(){
	color_=color;
	gl_Position=vec4(vec2(matrix*vec3(position,1)),0,1);
}`;


const fragment=`precision mediump float;
varying vec3 color_;


void main(){
	gl_FragColor=vec4(color_,1);
}`;


function createShader(type,source){
	const shader=gl.createShader(type);
	gl.shaderSource(shader,source);
	gl.compileShader(shader);
	if(gl.getShaderParameter(shader,gl.COMPILE_STATUS))
		return shader;
	alert(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}


function createProgram(){
	const vertexShader=createShader(gl.VERTEX_SHADER,vertex);
	const fragmentShader=createShader(gl.FRAGMENT_SHADER,fragment);
	const program=gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,fragmentShader);
	gl.linkProgram(program);
	gl.deleteShader(vertexShader);
	gl.deleteShader(fragmentShader);
	if(gl.getProgramParameter(program,gl.LINK_STATUS))
		return program;
	alert(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}


const mat3={
	projection(w,h){
		return [
			2/w,0,0,
			0,2/w,0,
			0,0,1
		]
	},
	translate(x,y){
		return [
			1,0,0,
			0,1,0,
			x,y,1
		]
	},
	rotate(angle){
		const c=Math.cos(angle*Math.PI/180);
		const s=Math.sin(angle*Math.PI/180);
		return [
			c,s,0,
			-s,c,0,
			0,0,1
		]
	},
	scale(x,y){
		return [
			x,0,0,
			0,y,0,
			0,0,1
		]
	},
	multiply(m1,m2){
		if(m1.length===9&&m2.length===9){
			return [
				m1[0]*m2[0]+m1[1]*m2[3]+m1[2]*m2[6],
				m1[0]*m2[1]+m1[1]*m2[4]+m1[2]*m2[7],
				m1[0]*m2[2]+m1[1]*m2[5]+m1[2]*m2[8],
				//
				m1[3]*m2[0]+m1[4]*m2[3]+m1[5]*m2[6],
				m1[3]*m2[1]+m1[4]*m2[4]+m1[5]*m2[7],
				m1[3]*m2[2]+m1[4]*m2[5]+m1[5]*m2[8],
				//
				m1[6]*m2[0]+m1[7]*m2[3]+m1[8]*m2[6],
				m1[6]*m2[1]+m1[7]*m2[4]+m1[8]*m2[7],
				m1[6]*m2[2]+m1[7]*m2[5]+m1[8]*m2[8],
				//
			]
		}
		if(m1.length===3&&m2.length===9){
			return [
				m1[0]*m2[0]+m1[1]*m2[3]+m1[2]*m2[6],
				m1[0]*m2[1]+m1[1]*m2[4]+m1[2]*m2[7],
				m1[0]*m2[2]+m1[1]*m2[5]+m1[2]*m2[8]
			]
		}
	}
}


function drawRect(mat,color){
	const data=[
		-50,-50,
		color[0],color[1],color[2],
		50,-50,
		color[0],color[1],color[2],
		50,50,
		color[0],color[1],color[2],
		50,50,
		color[0],color[1],color[2],
		-50,50,
		color[0],color[1],color[2],
		-50,-50,
		color[0],color[1],color[2],
	]
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
	gl.vertexAttribPointer(position,2,gl.FLOAT,false,20,0);
	gl.vertexAttribPointer(color,3,gl.FLOAT,false,20,8);
	gl.uniformMatrix3fv(matrix,false,mat);
	gl.drawArrays(gl.TRIANGLES,0,data.length/5);
}


function init(canvas){
	gl=canvas.getContext('webgl');
	const program=createProgram();
	gl.useProgram(program);
	gl.viewport(0,0,window.innerWidth,window.innerHeight);
	gl.clearColor(0,0,0,1);
	position=gl.getAttribLocation(program,'position');
	color=gl.getAttribLocation(program,'color');
	matrix=gl.getUniformLocation(program,'matrix');
	gl.enableVertexAttribArray(position);
	gl.enableVertexAttribArray(color);
	const buffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
	mat=mat3.projection(window.innerWidth,window.innerHeight);
}


function draw(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	drawRect(mat,[0,0.8,0.7]);
}


function setMatrix(x,y){
	let pF=mat3.multiply([-50,-50,1],mat);
	let pL=mat3.multiply([50,50,1],mat);
	x-=window.innerWidth*0.5;
	y-=window.innerHeight*0.5;
	let but=mat3.multiply([x,-y,1],mat3.projection(window.innerWidth,window.innerHeight));
	if((x>=pF[0]&&x<=pL[0])&&(y>=pF[1]&&y<=pL[1]))
		return true;
	return false;
}


export {init,draw,setMatrix};
