import {getActionFromState, StackActions} from '@react-navigation/native';
import type {NavigationAction} from '@react-navigation/native';
import linkingConfig from '@libs/Navigation/linkingConfig';
import NAVIGATORS from '@src/NAVIGATORS';
import type {GetPartialStateDiffReturnType} from './getPartialStateDiff';

/**
 * @param diff - Diff generated by getPartialDiff.
 * @returns Array of actions to dispatch to apply diff.
 */
function getActionsFromPartialDiff(diff: GetPartialStateDiffReturnType): NavigationAction[] {
    const actions: NavigationAction[] = [];

    const bottomTabDiff = diff[NAVIGATORS.BOTTOM_TAB_NAVIGATOR];
    const centralPaneDiff = diff[NAVIGATORS.CENTRAL_PANE_NAVIGATOR];
    const fullScreenDiff = diff[NAVIGATORS.FULL_SCREEN_NAVIGATOR];

    // There is only one bottom tab navigator so we can just push this route.
    if (bottomTabDiff) {
        actions.push(StackActions.push(bottomTabDiff.name, bottomTabDiff.params));
    }

    if (centralPaneDiff) {
        // In this case we have to wrap the inner central pane route with central pane navigator.
        actions.push(
            StackActions.push(NAVIGATORS.CENTRAL_PANE_NAVIGATOR, {
                screen: centralPaneDiff.name,
                params: centralPaneDiff.params,
            }),
        );
    }

    if (fullScreenDiff) {
        const action = getActionFromState({routes: [fullScreenDiff]}, linkingConfig.config);
        if (action) {
            actions.push(action);
        }
    }

    return actions;
}

export default getActionsFromPartialDiff;