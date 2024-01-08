import { renderHook, act } from "@testing-library/react";
import { useDragBullet } from "./useDragBullet";
import { useGetRectPropsByRef } from "./useGetRectPropsByRef";
import { isTouchDevice } from "@/utils/isTouchDevice";

jest.mock("./useGetRectPropsByRef");
jest.mock("@/utils/isTouchDevice");

describe("useDragBullet", () => {
  const trackX = 100;
  const trackY = 50;
  const trackWidth = 300;
  const minPosition = 10;
  const maxPosition = 90;
  (useGetRectPropsByRef as jest.Mock).mockReturnValue({ left: trackX, width: trackWidth });
  (isTouchDevice as jest.Mock).mockReturnValue(false);
  const draggableItemRef = { current: document.createElement("div") };
  const trackRef = { current: document.createElement("div") };

  test("should change isDragging from false to true onMouseDown and vice versa onMouseUp", () => {
    const { result } = renderHook(() =>
      useDragBullet({
        draggableItemRef,
        trackRef,
        position: null,
        onPositionChange: jest.fn()
      })
    );
    expect(result.current.isDragging).toBe(false);
    act(() => {
      draggableItemRef.current.dispatchEvent(new MouseEvent("mousedown"));
    });
    expect(result.current.isDragging).toBe(true);
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });
    expect(result.current.isDragging).toBe(false);
  });

  test("should call onPositionChange with the calculated newPosition onMouseMove", () => {
    const onPositionChangeMock = jest.fn();
    const position = null;

    renderHook(() =>
      useDragBullet({
        draggableItemRef,
        trackRef,
        position,
        onPositionChange: onPositionChangeMock,
        minPosition
      })
    );
    const clientX = trackX + 200;
    act(() => {
      draggableItemRef.current.dispatchEvent(new MouseEvent("mousedown"));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent("mousemove", { clientX }));
    });
    const newPosition = ((clientX - trackX) / trackWidth) * 100;
    expect(onPositionChangeMock).toHaveBeenCalledWith(newPosition);
  });

  test("should change the bullet style with received position", () => {
    const bulletPosition = 27;
    renderHook(() =>
      useDragBullet({
        draggableItemRef,
        trackRef,
        position: bulletPosition,
        onPositionChange: jest.fn()
      })
    );
    expect(draggableItemRef.current.style.left).toBe(`${bulletPosition}%`);
  });

  test("should place the bullet at maxPosition when position > maxPosition", () => {
    const bulletPosition = 98;
    renderHook(() =>
      useDragBullet({
        draggableItemRef,
        trackRef,
        position: bulletPosition,
        onPositionChange: jest.fn(),
        maxPosition
      })
    );
    expect(draggableItemRef.current.style.left).toBe(`${maxPosition}%`);
  });

  test("should place the bullet at minPosition when position < minPosition", () => {
    const bulletPosition = 7;
    renderHook(() =>
      useDragBullet({
        draggableItemRef,
        trackRef,
        position: bulletPosition,
        onPositionChange: jest.fn(),
        minPosition
      })
    );
    expect(draggableItemRef.current.style.left).toBe(`${minPosition}%`);
  });

  test("should call onPositionChange with the closest position when availablePositions are provided and is not dragging", async () => {
    const onPositionChangeMock = jest.fn();
    const bulletPosition = 26;
    const availablePositions = [15, 25, 35, 45];
    renderHook(() =>
      useDragBullet({
        draggableItemRef,
        trackRef,
        position: bulletPosition,
        onPositionChange: onPositionChangeMock,
        availablePositions
      })
    );
    expect(onPositionChangeMock).toHaveBeenCalledWith(25);
  });

  test("should call onDragEnd after dragging if a function is provided", () => {
    const onDragEndMock = jest.fn();

    renderHook(() =>
      useDragBullet({
        draggableItemRef,
        trackRef,
        position: null,
        onPositionChange: jest.fn(),
        onDragEnd: onDragEndMock
      })
    );
    act(() => {
      draggableItemRef.current.dispatchEvent(new MouseEvent("mousedown"));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });
    expect(onDragEndMock).toHaveBeenCalledTimes(1);
  });

  test("should call onPositionChange for minValue when the track is clicked closer to the min bullet than to the max bullet", () => {
    const onPositionChangeMock = jest.fn();
    const minBulletPosition = 20;
    const maxBulletPosition = 80;

    renderHook(() =>
      useDragBullet({
        draggableItemRef,
        trackRef,
        position: minBulletPosition,
        onPositionChange: onPositionChangeMock,
        onDragEnd: jest.fn(),
        maxPosition: maxBulletPosition
      })
    );
    act(() => {
      trackRef.current.dispatchEvent(
        new MouseEvent("click", {
          clientX: trackX + (trackWidth * (minBulletPosition + 10)) / 100,
          clientY: trackY
        })
      );
    });
    expect(onPositionChangeMock).toHaveBeenCalledTimes(1);
  });

  test("should not call onPositionChange for minValue when the track is clicked closer to the max bullet than to the min bullet", () => {
    const onPositionChangeMock = jest.fn();
    const minBulletPosition = 20;
    const maxBulletPosition = 80;

    renderHook(() =>
      useDragBullet({
        draggableItemRef,
        trackRef,
        position: minBulletPosition,
        onPositionChange: onPositionChangeMock,
        onDragEnd: jest.fn(),
        maxPosition: maxBulletPosition
      })
    );
    act(() => {
      trackRef.current.dispatchEvent(
        new MouseEvent("click", {
          clientX: trackX + (trackWidth * (maxBulletPosition - 10)) / 100,
          clientY: trackY
        })
      );
    });
    expect(onPositionChangeMock).not.toHaveBeenCalled();
  });

  test("should call onPositionChange for maxValue when the track is clicked closer to the max bullet than to the min bullet", () => {
    const onPositionChangeMock = jest.fn();
    const minBulletPosition = 20;
    const maxBulletPosition = 80;

    renderHook(() =>
      useDragBullet({
        draggableItemRef,
        trackRef,
        position: maxBulletPosition,
        onPositionChange: onPositionChangeMock,
        onDragEnd: jest.fn(),
        minPosition: minBulletPosition
      })
    );
    act(() => {
      trackRef.current.dispatchEvent(
        new MouseEvent("click", {
          clientX: trackX + (trackWidth * (maxBulletPosition - 10)) / 100,
          clientY: trackY
        })
      );
    });
    expect(onPositionChangeMock).toHaveBeenCalledTimes(1);
  });

  test("should not call onPositionChange for maxValue when the track is clicked closer to the min bullet than to the max bullet", () => {
    const onPositionChangeMock = jest.fn();
    const minBulletPosition = 20;
    const maxBulletPosition = 80;

    renderHook(() =>
      useDragBullet({
        draggableItemRef,
        trackRef,
        position: maxBulletPosition,
        onPositionChange: onPositionChangeMock,
        onDragEnd: jest.fn(),
        minPosition: minBulletPosition
      })
    );
    act(() => {
      trackRef.current.dispatchEvent(
        new MouseEvent("click", {
          clientX: trackX + (trackWidth * (minBulletPosition + 10)) / 100,
          clientY: trackY
        })
      );
    });
    expect(onPositionChangeMock).not.toHaveBeenCalled();
  });
});
