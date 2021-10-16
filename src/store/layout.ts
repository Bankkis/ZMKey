import { createStore, update } from 'nanostores';

export interface LayoutState {
  layout: Record<string, any>[]; // TODO
  selectedKey?: string | null;
}

const initialState: LayoutState = {
  layout: [],
  selectedKey: null,
};

export const layoutState = createStore<LayoutState>(() => {
  layoutState.set(initialState);
});

function selectKey(keyId: string | null): void {
  update(layoutState, (state) => ({
    ...state,
    selectedKey: keyId,
  }));
}

export const layoutActions = {
  selectKey,
};
