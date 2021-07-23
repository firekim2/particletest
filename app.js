import * as THREE from 'three';
import { Float32Attribute } from 'three';
import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';

import * as dat from "dat.gui";
import * as gsap from "gsap";

import mask from './img/mask.png';
import t1 from './img/a.jpeg';
import t2 from './img/b.jpeg';
import gsapCore from 'gsap/gsap-core';

export default class Sketch{
    constructor(){
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 2000 );
        this.camera.position.z = 500;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.time = 0;
        this.inAnimate = false;
        this.index = 0;

        this.textures = [
            new THREE.TextureLoader().load(t1),
            new THREE.TextureLoader().load(t2)
        ]

        this.mask = new THREE.TextureLoader().load(mask);

        document.querySelector("#container").appendChild( this.renderer.domElement );

        this.addMesh();
        this.mouseEffect();

        
        this.render();    
    }

    render = () => {   
        this.time++;
    
        this.renderer.render( this.scene, this.camera );
        this.material.uniforms.time.value = this.time;
        this.camera.position.setX(30 * Math.sin(0.01 * this.time));
        this.camera.lookAt(0,0,0);
        
        window.requestAnimationFrame(this.render.bind());
    }

    mouseEffect(){
        this.renderer.domElement.addEventListener("click", (e) => {
            if(!this.inAnimate) {
                this.index = (++this.index) % this.textures.length;
                this.material.uniforms.t.value = this.textures[this.index];
                this.animateInsert();
            }
            else this.animateOut();

            console.log(this.inAnimate)

        });
    }

    animateInsert(){
        gsapCore.to(this.material.uniforms.progress, {
            duration : 2,
            value: 1,
            ease: "Expo.easeOut"
        })
        this.inAnimate = true;
    }

    animateOut(){
        gsapCore.to(this.material.uniforms.progress, {
            duration : 2,
            value: 0,
            ease: "Expo.easeOut"
        });
        this.inAnimate = false;
    }

    addMesh(){
        this.size = 256;
        this.material = new THREE.ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms: {
                t: {type: "t", value: this.textures[this.index]},
                mask: {type: "t", value: this.mask},
                time: {type: "f", value: 10.0},
                progress: {type: "f", value: 0.0},
                size: {type: "f", value: this.size}
            },
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            depthWrite: false
        });

        this.geometry = new THREE.BufferGeometry();
        
        
        this.positions = new THREE.BufferAttribute(new Float32Array(this.size * this.size * 3), 3);
        this.coordinate = new THREE.BufferAttribute(new Float32Array(this.size * this.size * 3), 3);
        this.speeds = new THREE.BufferAttribute(new Float32Array(this.size * this.size), 1);
        let index = 0
        for (let i = 0 ; i < this.size; i++){
            for ( let j = 0 ; j < this.size ; j++){
                this.positions.setXYZ(index, i - this.size / 2, j - this.size / 2, 0);
                this.coordinate.setXYZ(index, i, j, 0);
                this.speeds.setX(index, rand(0.4, 3));
                index ++;
            }
        }

        function rand(a, b){
            return a + (b-a) * Math.random();
        }

        this.geometry.setAttribute("position", this.positions);
        this.geometry.setAttribute("aCoordinates", this.coordinate);
        this.geometry.setAttribute("aSpeed", this.speeds);

        this.mesh = new THREE.Points( this.geometry, this.material );
        this.scene.add( this.mesh );

    }
}

new Sketch();


