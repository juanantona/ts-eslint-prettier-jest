import { MotionSensor, VideoRecorder, VideoController } from '../core/videoController';

class FakeMotionSensor implements MotionSensor {
	constructor() {}
	isDetectingMotion(): boolean {
		return false;
	}
}

class FakeRecorder implements VideoRecorder {
	startRecording(): void {
		console.log('start recording...');
	}
	stopRecording(): void {
		console.log('stop recording...');
	}
}

describe('When the sensor works as expected', () => {
	let motionSensor: MotionSensor;
	let videoRecorder: VideoRecorder;
	let videoController: VideoController;

	beforeEach(() => {
		motionSensor = new FakeMotionSensor();
		videoRecorder = new FakeRecorder();
		videoController = new VideoController(videoRecorder, motionSensor);
	});

	describe("When the sensor doesn't detect movement", () => {
		it('Should stop recording', async () => {
			jest.spyOn(videoRecorder, 'stopRecording');

			videoController.recordMotion();

			expect(videoRecorder.stopRecording).toHaveBeenCalled();
		});
	});

	describe('When the sensor detects movement', () => {
		it('Should start recording', async () => {
			const stubSensor = jest.spyOn(motionSensor, 'isDetectingMotion');
			stubSensor.mockImplementation(() => true);
			jest.spyOn(videoRecorder, 'startRecording');

			videoController.recordMotion();

			expect(videoRecorder.startRecording).toHaveBeenCalled();
		});
	});
});
