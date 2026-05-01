"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useTransition } from "react";
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  FileText,
  Video,
  PlayCircle,
  ClipboardList,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  reorderModulesAction,
  deleteModuleAction,
  deleteResourceAction,
} from "@/lib/course-actions";
import { AddModuleDialog } from "./add-module-dialog";
import { AddResourceDialog } from "./add-resource-dialog";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────

type Resource = {
  id: string;
  type: "PDF" | "VIDEO" | "EXAM";
  titleEn: string;
  titleAr: string;
  order: number;
};

type Module = {
  id: string;
  titleEn: string;
  titleAr: string;
  order: number;
  resources: Resource[];
};

// ── Sortable Module Item ──────────────────────────────────────────

function SortableModuleItem({
  module,
  courseId,
  courseSlug,
  locale,
}: {
  module: Module;
  courseId: string;
  courseSlug: string;
  locale: string;
}) {
  const [open, setOpen] = useState(true);
  const [deleting, startDelete] = useTransition();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDeleteModule = () => {
    if (!confirm("Delete this module and all its resources?")) return;
    startDelete(async () => {
      await deleteModuleAction(module.id);
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-xl border border-border/40 bg-card overflow-hidden transition-shadow",
        isDragging && "shadow-xl shadow-primary/10"
      )}
    >
      {/* Module Header */}
      <div className="flex items-center gap-2 px-4 py-3">
        {/* Drag Handle */}
        <button
          className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Expand toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center gap-2 text-start"
        >
          {open ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{module.titleEn}</div>
            <div className="text-xs text-muted-foreground truncate">{module.titleAr}</div>
          </div>
          <span className="ms-auto text-xs text-muted-foreground shrink-0">
            {module.resources.length} resources
          </span>
        </button>

        {/* Delete module */}
        <button
          onClick={handleDeleteModule}
          disabled={deleting}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Resources List */}
      {open && (
        <div className="border-t border-border/40 divide-y divide-border/20">
          {module.resources.map((resource) => (
            <ResourceRow
              key={resource.id}
              resource={resource}
              courseSlug={courseSlug}
              locale={locale}
            />
          ))}

          {/* Add Resource */}
          <div className="px-4 py-2.5">
            <AddResourceDialog moduleId={module.id} courseSlug={courseSlug} />
          </div>
        </div>
      )}
    </div>
  );
}

function ResourceRow({
  resource,
  courseSlug,
  locale,
}: {
  resource: Resource;
  courseSlug: string;
  locale: string;
}) {
  const [deleting, startDelete] = useTransition();

  const iconConfig = {
    PDF:   { Icon: FileText,     bg: "bg-primary/10",   text: "text-primary",   label: "PDF" },
    VIDEO: { Icon: PlayCircle,   bg: "bg-red-500/10",   text: "text-red-500",   label: "Video" },
    EXAM:  { Icon: ClipboardList, bg: "bg-amber-500/10", text: "text-amber-500", label: "Exam" },
  }[resource.type] ?? { Icon: FileText, bg: "bg-primary/10", text: "text-primary", label: resource.type };

  const { Icon, bg, text, label } = iconConfig;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/30 transition-colors group">
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${bg} ${text}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{resource.titleEn}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
      <button
        onClick={() => {
          if (!confirm("Delete this resource?")) return;
          startDelete(async () => {
            await deleteResourceAction(resource.id);
          });
        }}
        disabled={deleting}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all disabled:opacity-50"
      >
        {deleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}

// ── Main Module List ──────────────────────────────────────────────

export function ModuleList({
  modules,
  courseId,
  courseSlug,
  locale,
}: {
  modules: Module[];
  courseId: string;
  courseSlug: string;
  locale: string;
}) {
  const [items, setItems] = useState(modules);
  const [, startReorder] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((m) => m.id === active.id);
    const newIndex = items.findIndex((m) => m.id === over.id);

    const newItems = [...items];
    const [moved] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, moved);
    setItems(newItems);

    startReorder(async () => {
      await reorderModulesAction(
        courseId,
        newItems.map((m) => m.id)
      );
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Modules</h2>
        <AddModuleDialog courseId={courseId} courseSlug={courseSlug} />
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No modules yet. Add your first module above.
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((module) => (
            <SortableModuleItem
              key={module.id}
              module={module}
              courseId={courseId}
              courseSlug={courseSlug}
              locale={locale}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
