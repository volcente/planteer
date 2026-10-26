import { ElementRef, inject, Service } from '@angular/core';
import { Camera, Scene, WebGLRenderer } from 'three';

@Service({
	autoProvided: false,
})
export class ThreejsService {
	private readonly canvasElement = inject(ElementRef<HTMLCanvasElement>);

	private readonly camera: Camera | null = null;
	private readonly renderer: WebGLRenderer | null = null;
	private readonly scene: Scene | null = null;

	constructor() {
		console.log(this.canvasElement);
	}
}
