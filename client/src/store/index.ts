import { makeAutoObservable } from "mobx";

export interface storeInterface {
  isLoading: boolean;
  userId?: string;
}
export default class Store {
  state: storeInterface;
  constructor() {
    this.state = {
      isLoading: false,
      userId: undefined,
    };
    makeAutoObservable(this);
  }

  set isLoading(value: boolean) {
    this.state.isLoading = value;
  }
  set userId(value: string | undefined) {
    this.state.userId = value;
  }

}
