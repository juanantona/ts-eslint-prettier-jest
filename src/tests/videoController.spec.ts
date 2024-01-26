import { MotionSensor, VideoRecorder } from '../core/videoController';

class VideoRecorderSpy implements VideoRecorder {
	public isRecording: boolean;
	startRecording(): void {
		this.isRecording = true;
	}
	stopRecording(): void {
		this.isRecording = false;
	}
}

describe('When the sensor works as expected', () => {
	class MotionSensorStub implements MotionSensor {
		constructor(private stubMotion: boolean) {}
		isDetectingMotion(): boolean {
			return this.stubMotion;
		}
	}
	describe('When the sensor detects movement', () => {
		it('Should start recording', async () => {
			const { VideoController } = await import('../core/videoController');
			const motionSensor = new MotionSensorStub(true);
			const videoRecorder = new VideoRecorderSpy();
			const videoController = new VideoController(videoRecorder, motionSensor);

			videoController.recordMotion();

			expect(videoRecorder.isRecording).toBeTruthy();
		});
	});

	describe("When the sensor doesn't detect movement", () => {
		it('Should stop recording', async () => {
			const { VideoController } = await import('../core/videoController');
			const motionSensor = new MotionSensorStub(false);
			const videoRecorder = new VideoRecorderSpy();
			const videoController = new VideoController(videoRecorder, motionSensor);

			videoController.recordMotion();

			expect(videoRecorder.isRecording).toBeFalsy();
		});
	});

	describe('When the controller start to work', () => {
		it("Should start recording is sensor doesn't detect movement after a second", async () => {
			jest.useFakeTimers();
			const { VideoController } = await import('../core/videoController');
			const motionSensor = new MotionSensorStub(true);
			const videoRecorder = new VideoRecorderSpy();
			const videoController = new VideoController(videoRecorder, motionSensor);

			videoController.start();
			expect(videoRecorder.isRecording).toBe(undefined);
			jest.advanceTimersByTime(1000);
			expect(videoRecorder.isRecording).toBeTruthy();
		});

		it('Should check sensor every second', async () => {
			jest.useFakeTimers();
			const { VideoController } = await import('../core/videoController');
			const motionSensor = new MotionSensorStub(true);
			const videoRecorder = new VideoRecorderSpy();
			const videoController = new VideoController(videoRecorder, motionSensor);

			videoController.recordMotion = jest.fn(videoController.recordMotion);

			videoController.start();
			jest.advanceTimersByTime(1000);
			expect(videoController.recordMotion).toHaveBeenCalledTimes(1);
			jest.advanceTimersByTime(1000);
			expect(videoController.recordMotion).toHaveBeenCalledTimes(2);
			jest.advanceTimersByTime(1000);
			expect(videoController.recordMotion).toHaveBeenCalledTimes(3);
		});
	});
});

describe('When the sensor throws an error', () => {
	class MotionSensorStub implements MotionSensor {
		constructor() {}
		isDetectingMotion(): boolean {
			throw new Error();
		}
	}

	it('Should stop recording', async () => {
		const { VideoController } = await import('../core/videoController');
		const motionSensor = new MotionSensorStub();
		const videoRecorder = new VideoRecorderSpy();
		const videoController = new VideoController(videoRecorder, motionSensor);

		videoController.recordMotion();

		expect(videoRecorder.isRecording).toBeFalsy();
	});
});
