import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable()

// class for deactivate route
// created to prevent losing changes what user makes when updating profile in edit mode
// and accidentally click in some route and redirect to other view until save changes
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent> {
// we send our component as property to have access to form
canDeactivate(component: MemberEditComponent) {
    // if user make any changes in form (.dirty) (editForm our form name)
    // and try to redirect to other view
    if (component.editForm.dirty) {
        // dialog box will popup with information for user
        return confirm('Are you sure you want to continue? Any unsaved changes will be lost.');
    }

    return true;
}
}
