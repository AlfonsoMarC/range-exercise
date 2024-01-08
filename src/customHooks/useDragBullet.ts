import React, { useEffect, useState } from "react";
import { useGetRectPropsByRef } from "./useGetRectPropsByRef";
import { getClosestNumber } from "@/utils/getClosestNumber";
import { isTouchDevice } from "@/utils/isTouchDevice";

interface DragBulletArgs {
  draggableItemRef: React.RefObject<HTMLDivElement>;
  trackRef: React.RefObject<HTMLDivElement>;
  position: number | null;
  onPositionChange: (newPosition: number | null) => void;
  onDragEnd?: () => void;
  minPosition?: number | null;
  maxPosition?: number | null;
  availablePositions?: number[] | null;
}
interface DragBulletArgsRet {
  isDragging: boolean;
}

// Uses the position of the bullet in percentage
export const useDragBullet = ({
  draggableItemRef,
  trackRef,
  position,
  onPositionChange,
  onDragEnd,
  minPosition,
  maxPosition,
  availablePositions
}: DragBulletArgs): DragBulletArgsRet => {
  const isTouch = isTouchDevice();
  const formattedAvailablePositions =
    availablePositions && [...new Set(availablePositions)].sort((a, b) => a - b);
  const draggableItem = draggableItemRef.current;
  const track = trackRef.current;
  const { left: containerX, width: containerWidth } = useGetRectPropsByRef(trackRef);

  const [isDragging, setIsDragging] = useState(false);

  // Dragging bullet hook
  useEffect(() => {
    if (!draggableItem || !track || typeof containerX !== "number" || !containerWidth) {
      return;
    }

    const onMouseDown = (e: MouseEvent | TouchEvent): void => {
      if (!isTouch) {
        e.preventDefault();
      }
      e.stopPropagation();
      setIsDragging(true);
    };

    const onMouseUp = (e: MouseEvent | TouchEvent): void => {
      if (!isTouch) {
        e.preventDefault();
      }
      if (!isDragging) {
        return;
      }
      if (onDragEnd) {
        onDragEnd();
      }
      setIsDragging(false);
    };

    const onMouseMove = (e: MouseEvent | TouchEvent): void => {
      if (!isTouch) {
        e.preventDefault();
      }
      if (!isDragging) {
        return;
      }
      const clientX = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const newPosition = Math.min(
        Math.max(minPosition ?? 0, ((clientX - containerX) / containerWidth) * 100),
        maxPosition ?? 100
      );
      onPositionChange(newPosition);
    };

    draggableItem.addEventListener(isTouch ? "touchstart" : "mousedown", onMouseDown);
    (draggableItem.ownerDocument ?? window).addEventListener(
      isTouch ? "touchend" : "mouseup",
      onMouseUp
    );
    (draggableItem.ownerDocument ?? window).addEventListener(
      isTouch ? "touchmove" : "mousemove",
      onMouseMove
    );

    return () => {
      draggableItem.removeEventListener(isTouch ? "touchstart" : "mousedown", onMouseDown);
      (draggableItem.ownerDocument ?? window).removeEventListener(
        isTouch ? "touchend" : "mouseup",
        onMouseUp
      );
      (draggableItem.ownerDocument ?? window).removeEventListener(
        isTouch ? "touchmove" : "mousemove",
        onMouseMove
      );
    };
  }, [
    containerWidth,
    containerX,
    draggableItem,
    formattedAvailablePositions,
    isDragging,
    isTouch,
    maxPosition,
    minPosition,
    onDragEnd,
    onPositionChange,
    position,
    track
  ]);

  // Click on track hook
  useEffect(() => {
    if (
      !draggableItem ||
      !track ||
      typeof containerX !== "number" ||
      !containerWidth ||
      typeof position !== "number"
    ) {
      return;
    }

    const onClick = (e: MouseEvent | TouchEvent): void => {
      if (!isTouch) {
        e.preventDefault();
      }
      e.stopPropagation();

      const clientX = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const mousePosition = Math.min(
        Math.max(minPosition ?? 0, ((clientX - containerX) / containerWidth) * 100),
        maxPosition ?? 100
      );
      if (
        (maxPosition &&
          Math.abs(mousePosition - position) < Math.abs(mousePosition - maxPosition)) ||
        (minPosition && Math.abs(mousePosition - position) < Math.abs(mousePosition - minPosition))
      ) {
        const newPosition = formattedAvailablePositions
          ? getClosestNumber(formattedAvailablePositions, mousePosition)
          : mousePosition;

        onPositionChange(newPosition);
      }
    };

    track.addEventListener(isTouch ? "touchstart" : "click", onClick);

    return () => {
      track.removeEventListener(isTouch ? "touchstart" : "click", onClick);
    };
  }, [
    containerWidth,
    containerX,
    draggableItem,
    formattedAvailablePositions,
    isTouch,
    maxPosition,
    minPosition,
    onPositionChange,
    position,
    track
  ]);

  // Bullet position hook
  useEffect(() => {
    if (!draggableItem || typeof position !== "number") {
      return;
    }
    const validPosition = Math.min(Math.max(minPosition ?? 0, position), maxPosition ?? 100);

    // While dragging, it sets the new left position to the draggable item
    draggableItem.style.left = `${validPosition}%`;

    // Only for discrete mode (formattedAvailablePositions truthy). When the drag ends repositions the bullet to the closest available position
    if (!isDragging && formattedAvailablePositions) {
      const closetPosition = getClosestNumber(formattedAvailablePositions, validPosition);
      onPositionChange(closetPosition);
    }
  }, [
    draggableItem,
    draggableItemRef,
    formattedAvailablePositions,
    isDragging,
    maxPosition,
    minPosition,
    onPositionChange,
    position
  ]);

  return { isDragging };
};
