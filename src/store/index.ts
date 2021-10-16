import { WritableStore } from 'nanostores';
import { LayoutState, layoutState } from './layout';
export { layoutActions } from './layout';

export interface RootState {
  layout: WritableStore<LayoutState>;
}

export const rootState: RootState = {
  layout: layoutState,
};
