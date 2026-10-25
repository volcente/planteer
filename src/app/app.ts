import {
	Component,
	computed,
	ElementRef,
	Injectable,
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

@Injectable()
class MeshController {
	private readonly meshes = signal<Mesh[]>([]);

	addMesh(mesh: Mesh) {
		console.info('Mesh added!');
		this.meshes().push(mesh);
	}

	removeMesh(meshID: number) {
		const meshIndex = this.meshes().findIndex(({ id }) => id === meshID);
		if (meshIndex === -1) {
			return null;
		}
		const removedMesh = this.meshes().splice(meshIndex, 1).at(0);
		if (!removedMesh) {
			console.warn("Mesh with given ID doesn't exist.");
			return null;
		}

		removedMesh.dispose();
		removedMesh.geometry.dispose();
		return removedMesh;
	}

	getMesh(meshID: number) {
		return this.meshes().find(({ id }) => meshID === id);
	}

	getMeshesNames() {
		return this.meshes().flatMap(({ name, id }) => ({ id, name }));
	}
}

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

	readonly meshController = new MeshController();

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

	// Handling Window Resizing

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

	debouncedCheckWindowSize = debounce((_event: UIEvent) => {
		this.width.set(window.innerWidth);
		this.height.set(window.innerHeight);
		this.updateCamera();
		this.updateRenderer();
	}, 125);

	// Initialisation of the Three.js

	createRenderer(renderer: WebGLRenderer) {
		this.renderer = renderer;
		this.renderer.setPixelRatio(window.devicePixelRatio);
	}

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

	addCube() {
		if (!this.renderer) {
			console.warn('No renderer available');
			return;
		}

		const boxWidth = 30;
		const boxHeight = 30;
		const boxDepth = 30;
		const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);

		const emeraldColors = [
			0x50c878, 0x046307, 0x2ecc71, 0x00a86b, 0x008f69, 0x3cb371, 0x01796f,
			0x009b77, 0x228b22, 0x006a4e,
		];

		const randomElement = Math.floor(Math.random() * emeraldColors.length);
		const randomColorIndex =
			randomElement === emeraldColors.length
				? randomElement - 1
				: randomElement;

		const material = new MeshPhongMaterial({
			color: emeraldColors[randomColorIndex],
		}); // greenish blue

		const cube = new Mesh(geometry, material);
		cube.position.x =
			(Math.random() < 0.5 ? -1 : 1) * Math.ceil(Math.random() * 160) - 80;
		cube.position.y = 0;
		this.scene.add(cube);
		this.meshController.addMesh(cube);
	}

	removeObject(objectID: number, type: 'Mesh') {
		if (type === 'Mesh') {
			const removedObject = this.meshController.removeMesh(objectID);
			if (!removedObject) {
				return;
			}
			this.scene.remove(removedObject);
			this.updateCamera();
			this.updateRenderer();
		} else {
			console.warn(`Unknown object type: ${String(type)}`);
			return;
		}
	}

	// THE Loop

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

		camera.position.z = 200;

		function render(_time: number) {
			if (!renderer) {
				return;
			}

			_time *= 0.001;

			renderer.render(scene, camera);
			requestAnimationFrame(render);
		}

		window.requestAnimationFrame(render);
	}

	// Clean-up

	ngOnDestroy() {
		this.scene.dispose();
		this.camera.dispose();
		this.renderer?.dispose();
	}
}
