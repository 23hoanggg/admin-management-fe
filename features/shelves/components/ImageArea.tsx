import { useRef } from "react";
import {
  ImageInfo,
  ShelfItem,
  Point,
  Polygon,
  PolygonDraft,
} from "../types/shelf";
import StaticPolygon from "./StaticPolygon";
import EditablePolygon from "./EditablePolygon";
import { bboxToPolygon } from "../utils/geometry";

type PolygonState = "normal" | "matched" | "dimmed";

function getPolygonState(
  id: string,
  selectedId: string | null,
  matchedIds: Set<string> | null,
): PolygonState {
  if (selectedId !== null) return "dimmed";
  if (matchedIds === null) return "normal";
  return matchedIds.has(id) ? "matched" : "dimmed";
}

interface ImageAreaProps {
  items: ShelfItem[];
  hoveredId: string | null;
  selectedId: string | null;
  draft: PolygonDraft | null;
  image: ImageInfo;
  matchedIds: Set<string> | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
  onDraftChange: (points: Polygon) => void;
}

export default function ImageArea({
  items,
  hoveredId,
  selectedId,
  draft,
  image,
  matchedIds,
  onHover,
  onSelect,
  onDraftChange,
}: ImageAreaProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const getSvgPoint = (clientX: number, clientY: number): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };

    const point = svgRef.current.createSVGPoint();
    point.x = clientX;
    point.y = clientY;

    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };

    const transformed = point.matrixTransform(ctm.inverse());
    return { x: transformed.x, y: transformed.y };
  };

  const unselectedItems = items.filter(
    (item) => item.img_crop_id && item.img_crop_id !== selectedId,
  );

  const selectedItem = items.find((item) => item.img_crop_id === selectedId);

  return (
    <div className="relative flex-1 bg-slate-200 rounded-lg p-2 flex items-center justify-center overflow-auto h-[50vh] sm:h-[55vh] md:h-full w-full">
      <div className="relative h-full transition-all duration-150">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${image.width} ${image.height}`}
          className="w-full h-full block"
        >
          <image
            href={image.src}
            width={image.width}
            height={image.height}
            preserveAspectRatio="none"
            className="pointer-events-none"
          />

          {/* Unselected items rendered first */}
          {unselectedItems.map((item) => {
            const points: Polygon = item.polygon ?? bboxToPolygon(item.bboxes);
            const state = getPolygonState(
              item.img_crop_id,
              selectedId,
              matchedIds,
            );

            return (
              <g
                key={item.img_crop_id}
                opacity={state === "dimmed" ? 0.1 : 1}
                pointerEvents={state === "dimmed" ? "none" : "auto"}
              >
                <StaticPolygon
                  points={points}
                  shelfDigit={item.shelf_digit}
                  itemId={item.img_crop_id}
                  isHovered={hoveredId === item.img_crop_id}
                  isMatched={state === "matched"}
                  onHover={onHover}
                  onSelect={onSelect}
                />
              </g>
            );
          })}

          {/* Selected / Editable item rendered last (highest z-order) */}
          {selectedItem && draft && (
            <EditablePolygon
              key={selectedItem.img_crop_id}
              points={draft.points}
              shelfDigit={selectedItem.shelf_digit}
              imageWidth={image.width}
              imageHeight={image.height}
              getSvgPoint={getSvgPoint}
              onChange={onDraftChange}
            />
          )}
        </svg>
      </div>
    </div>
  );
}
