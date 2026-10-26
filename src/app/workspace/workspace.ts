import { Component, inject } from '@angular/core';

import { EntityService } from '../entity-service';
import { ThreejsService } from '../threejs-service';
import { WorkspaceCanvas } from '../workspace-canvas';

@Component({
	selector: 'workspace',
	templateUrl: './workspace.html',
	imports: [WorkspaceCanvas],
	providers: [ThreejsService],
})
export class Workspace {
	private readonly entityService = inject(EntityService);

	listPlanters() {
		return this.entityService.listEntities(({ type }) => type === 'PlanterPot');
	}
}
