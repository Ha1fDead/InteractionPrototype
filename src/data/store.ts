export default abstract class VDataStore {
	private UpdateCallbacks: Function[] = [];

	AddCallback(cb: Function): void {
		this.UpdateCallbacks.push(cb);
	}

	protected BroadcastUpdates(): void {
		for(let cb of this.UpdateCallbacks) {
			cb();
		}
	}
}