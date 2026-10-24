import {
	Component,
	computed,
	ElementRef,
	signal,
	viewChild,
} from '@angular/core';
import {
	BoxGeometry,
	DirectionalLight,
	Mesh,
	MeshPhongMaterial,
	PerspectiveCamera,
	Scene,
	Vector2,
	WebGLRenderer,
} from 'three';

const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
	cb: T,
	delay: number,
) => {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => cb(...args), delay);
	};
};

const DEFAULT_FOV = 90;
const NEAR_PLANE = 0.1;
const FAR_PLANE = 1000;

@Component({
	selector: 'app-root',
	styleUrl: './app.css',
	templateUrl: './app.html',
	host: {
		'(window:resize)': 'debouncedCheckWindowSize($event)',
	},
})
export class App {
	private readonly width = signal(window.innerWidth);
	private readonly height = signal(window.innerHeight);
	private readonly fov = signal(DEFAULT_FOV);
	private readonly nearPlane = signal(NEAR_PLANE);
	private readonly farPlane = signal(FAR_PLANE);

	private aspectRatio = computed(() => this.width() / this.height());

	private planteerWorkspace =
		viewChild<ElementRef<HTMLCanvasElement>>('planteerWorkspace');

	private readonly scene = new Scene();
	private camera = new PerspectiveCamera(
		this.fov(),
		this.aspectRatio(),
		this.nearPlane(),
		this.farPlane(),
	);
	private renderer: WebGLRenderer | null = null;

	updateCamera() {
		this.camera.aspect = this.aspectRatio();
		this.camera.fov = this.fov();
		this.camera.near = this.nearPlane();
		this.camera.far = this.farPlane();
		this.camera.updateProjectionMatrix();
	}

	updateRenderer() {
		if (!this.renderer) {
			return;
		}

		this.renderer.setSize(this.width(), this.height(), false);
	}

	createRenderer(renderer: WebGLRenderer) {
		this.renderer = renderer;
		this.renderer.setPixelRatio(window.devicePixelRatio);
	}

	debouncedCheckWindowSize = debounce((_event: UIEvent) => {
		this.width.set(window.innerWidth);
		this.height.set(window.innerHeight);
		this.updateCamera();
		this.updateRenderer();
	}, 125);

	ngAfterViewInit() {
		const planteerWorkspace = this.planteerWorkspace()?.nativeElement;
		if (!planteerWorkspace) {
			console.log("Can't find native element of planteerWorkspace");
			return;
		}

		this.createRenderer(
			new WebGLRenderer({
				canvas: planteerWorkspace,
				antialias: true,
			}),
		);
		this.animate();
	}

	animate() {
		const renderer = this.renderer;
		const camera = this.camera;
		const scene = this.scene;

		{
			const color = 0xffffff;
			const intensity = 6;
			const light = new DirectionalLight(color, intensity);
			light.position.set(-1, 2, 4);
			scene.add(light);
		}
		const boxWidth = 300;
		const boxHeight = 300;
		const boxDepth = 300;
		const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);

		const material = new MeshPhongMaterial({
			color: 0xdd44ff,
			transparent: true,
			opacity: 0.5,
		}); // greenish blue

		const cube = new Mesh(geometry, material);
		scene.add(cube);

		camera.position.z = 400;

		function render(time: number) {
			if (!renderer) {
				return;
			}

			time *= 0.001;

			cube.rotation.x = time;
			cube.rotation.y = time;

			renderer.render(scene, camera);
			requestAnimationFrame(render);
		}

		window.requestAnimationFrame(render);
	}

	ngOnDestroy() {
		this.scene.dispose();
		this.camera.dispose();
		this.renderer?.dispose();
	}
}
