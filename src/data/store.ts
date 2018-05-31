export default class TextStore {
	private Data: string[] = [];

	// eventually I think this will change to using observables RxJs
	private UpdateCallbacks: Function[] = [];

	constructor() {

	}

	/**
	 * CONSIDERATIONS FOR STORE PATTERN:
	 * 
	 * 1. let's assume I have multiple stages
	 * 2. let's assume I'm in a networked environment
	 * 3. I have a stage open that another player doesn't have open
	 * 4. It doesn't make sense to transmit that stage's data to that player
	 * 
	 * StageStore[]
	 * ItemStore[]
	 */

	/**
	 * In the future, perhaps this should return immutable array?
	 */
	GetAllData(): string[] {
		return this.Data;
	}
	
	/**
	 * In the future, perhaps this should return immutable reference?
	 */
	GetData(index: number): string {
		return this.Data[index];
	}

	InsertData(index: number, data: string): void {
		this.Data.splice(index, 0, data);
		this.BroadcastUpdates();
	}

	RemoveData(index: number): string {
		let removedData = this.Data.splice(index, 1)[0];
		this.BroadcastUpdates();
		return removedData;
	}

	GetDataLength(): number {
		return this.Data.length;
	}

	AddCallback(cb: Function): void {
		this.UpdateCallbacks.push(cb);
	}

	private BroadcastUpdates(): void {
		for(let cb of this.UpdateCallbacks) {
			cb();
		}
	}
}