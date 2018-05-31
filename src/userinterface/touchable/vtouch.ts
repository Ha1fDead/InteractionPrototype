export default interface VTouch extends Touch {
	/**
	 * When the touch event started using High Precision time
	 */
	TouchStart: number;

	/**
	 * Timers related to this touch event 
	 */
	Timers: number[];
}