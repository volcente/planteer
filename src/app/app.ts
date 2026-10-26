import { Component } from '@angular/core';

import { EntityService } from './entity-service';
import { ThreejsService } from './threejs-service';
import { Workspace } from './workspace';

@Component({
	selector: 'app-root',
	styleUrl: './app.css',
	templateUrl: './app.html',
	imports: [Workspace],
	providers: [EntityService, ThreejsService],
})
export class App {}
