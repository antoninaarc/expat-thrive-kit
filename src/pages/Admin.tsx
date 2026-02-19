import { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Plus, Trash2, Save, BookOpen, Lightbulb, MessageSquare, Layers, MessageSquareHeart } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

/* ───────────── ARTICLES TAB ───────────── */
const ArticlesTab = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const { data: articles } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const saveMut = useMutation({
    mutationFn: async (article: any) => {
      if (article.id) {
        const { error } = await supabase.from("articles").update({
          title: article.title, slug: article.slug, category: article.category,
          summary: article.summary, content: article.content, author: article.author,
          published: article.published, read_time_minutes: article.read_time_minutes,
          cover_image_url: article.cover_image_url,
        }).eq("id", article.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("articles").insert({
          title: article.title, slug: article.slug, category: article.category,
          summary: article.summary, content: article.content, author: article.author,
          published: article.published, read_time_minutes: article.read_time_minutes,
          cover_image_url: article.cover_image_url,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-articles"] });
      setEditing(null);
      toast({ title: "Artículo guardado ✓" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-articles"] });
      toast({ title: "Artículo eliminado" });
    },
  });

  const blank = { title: "", slug: "", category: "bienestar", summary: "", content: "", author: "Rooted Abroad", published: false, read_time_minutes: 5, cover_image_url: "" };

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-semibold text-lg">{editing.id ? "Editar artículo" : "Nuevo artículo"}</h3>
          <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Título" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <Input placeholder="Slug (url-friendly)" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
          <Input placeholder="Categoría" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
          <Input placeholder="Autor" value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />
          <Input type="number" placeholder="Min. lectura" value={editing.read_time_minutes} onChange={(e) => setEditing({ ...editing, read_time_minutes: Number(e.target.value) })} />
          <Input placeholder="URL imagen portada" value={editing.cover_image_url || ""} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} />
        </div>
        <Input placeholder="Resumen" value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />
        <Textarea placeholder="Contenido (Markdown)" value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={12} />
        <div className="flex items-center gap-3">
          <Switch checked={editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} />
          <span className="text-sm">{editing.published ? "Publicado" : "Borrador"}</span>
        </div>
        <Button onClick={() => saveMut.mutate(editing)} disabled={!editing.title || !editing.slug || saveMut.isPending} className="w-full">
          <Save className="w-4 h-4 mr-2" /> Guardar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button onClick={() => setEditing(blank)} className="w-full"><Plus className="w-4 h-4 mr-2" /> Nuevo artículo</Button>
      {articles?.map((a: any) => (
        <div key={a.id} className="glass rounded-xl p-4 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${a.published ? "bg-green-500" : "bg-yellow-500"}`} />
              <span className="font-medium text-sm text-foreground truncate">{a.title}</span>
            </div>
            <span className="text-xs text-muted-foreground">{a.category} · {a.read_time_minutes} min</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setEditing(a)}>Editar</Button>
            <Button size="sm" variant="ghost" onClick={() => deleteMut.mutate(a.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        </div>
      ))}
      {articles?.length === 0 && <p className="text-center text-muted-foreground py-8">No hay artículos aún</p>}
    </div>
  );
};

/* ───────────── JOURNAL PROMPTS TAB ───────────── */
const PromptsTab = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const { data: prompts } = useQuery({
    queryKey: ["admin-prompts"],
    queryFn: async () => {
      const { data } = await supabase.from("journal_prompts").select("*").order("day_index");
      return data || [];
    },
  });

  const saveMut = useMutation({
    mutationFn: async (p: any) => {
      if (p.id) {
        const { error } = await supabase.from("journal_prompts").update({
          day_index: p.day_index, prompt_es: p.prompt_es, prompt_en: p.prompt_en, active: p.active,
        }).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("journal_prompts").insert({
          day_index: p.day_index, prompt_es: p.prompt_es, prompt_en: p.prompt_en, active: p.active,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-prompts"] });
      setEditing(null);
      toast({ title: "Prompt guardado ✓" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journal_prompts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-prompts"] }),
  });

  const blank = { day_index: (prompts?.length || 0), prompt_es: "", prompt_en: "", active: true };

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-semibold text-lg">{editing.id ? "Editar prompt" : "Nuevo prompt"}</h3>
          <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
        </div>
        <Input type="number" placeholder="Índice del día" value={editing.day_index} onChange={(e) => setEditing({ ...editing, day_index: Number(e.target.value) })} />
        <Textarea placeholder="Prompt en español" value={editing.prompt_es} onChange={(e) => setEditing({ ...editing, prompt_es: e.target.value })} rows={3} />
        <Textarea placeholder="Prompt in English" value={editing.prompt_en} onChange={(e) => setEditing({ ...editing, prompt_en: e.target.value })} rows={3} />
        <div className="flex items-center gap-3">
          <Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
          <span className="text-sm">{editing.active ? "Activo" : "Inactivo"}</span>
        </div>
        <Button onClick={() => saveMut.mutate(editing)} disabled={!editing.prompt_es || saveMut.isPending} className="w-full">
          <Save className="w-4 h-4 mr-2" /> Guardar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button onClick={() => setEditing(blank)} className="w-full"><Plus className="w-4 h-4 mr-2" /> Nuevo prompt</Button>
      {prompts?.map((p: any) => (
        <div key={p.id} className="glass rounded-xl p-3 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-primary">Día {p.day_index}</span>
              <span className={`w-2 h-2 rounded-full ${p.active ? "bg-green-500" : "bg-red-500"}`} />
            </div>
            <p className="text-sm text-foreground line-clamp-2">{p.prompt_es}</p>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setEditing(p)}>Editar</Button>
            <Button size="sm" variant="ghost" onClick={() => deleteMut.mutate(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        </div>
      ))}
      {prompts?.length === 0 && <p className="text-center text-muted-foreground py-8">No hay prompts aún. Los prompts hardcodeados se usan como fallback.</p>}
    </div>
  );
};

/* ───────────── DAILY TIPS TAB ───────────── */
const TipsTab = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const { data: tips } = useQuery({
    queryKey: ["admin-tips"],
    queryFn: async () => {
      const { data } = await supabase.from("daily_tips").select("*").order("day_index");
      return data || [];
    },
  });

  const saveMut = useMutation({
    mutationFn: async (tip: any) => {
      if (tip.id) {
        const { error } = await supabase.from("daily_tips").update({
          day_index: tip.day_index, tip_es: tip.tip_es, tip_en: tip.tip_en, icon: tip.icon, active: tip.active,
        }).eq("id", tip.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("daily_tips").insert({
          day_index: tip.day_index, tip_es: tip.tip_es, tip_en: tip.tip_en, icon: tip.icon, active: tip.active,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tips"] });
      setEditing(null);
      toast({ title: "Tip guardado ✓" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("daily_tips").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tips"] }),
  });

  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const blank = { day_index: 0, tip_es: "", tip_en: "", icon: "💡", active: true };

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-semibold text-lg">{editing.id ? "Editar tip" : "Nuevo tip"}</h3>
          <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input type="number" placeholder="Día (0=Dom, 6=Sáb)" value={editing.day_index} onChange={(e) => setEditing({ ...editing, day_index: Number(e.target.value) })} />
          <Input placeholder="Icono (emoji)" value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
        </div>
        <Textarea placeholder="Tip en español" value={editing.tip_es} onChange={(e) => setEditing({ ...editing, tip_es: e.target.value })} rows={3} />
        <Textarea placeholder="Tip in English" value={editing.tip_en} onChange={(e) => setEditing({ ...editing, tip_en: e.target.value })} rows={3} />
        <div className="flex items-center gap-3">
          <Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
          <span className="text-sm">{editing.active ? "Activo" : "Inactivo"}</span>
        </div>
        <Button onClick={() => saveMut.mutate(editing)} disabled={!editing.tip_es || saveMut.isPending} className="w-full">
          <Save className="w-4 h-4 mr-2" /> Guardar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button onClick={() => setEditing(blank)} className="w-full"><Plus className="w-4 h-4 mr-2" /> Nuevo tip</Button>
      {tips?.map((tip: any) => (
        <div key={tip.id} className="glass rounded-xl p-3 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span>{tip.icon}</span>
              <span className="text-xs font-bold text-primary">{dayNames[tip.day_index] || `Día ${tip.day_index}`}</span>
            </div>
            <p className="text-sm text-foreground line-clamp-2">{tip.tip_es}</p>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setEditing(tip)}>Editar</Button>
            <Button size="sm" variant="ghost" onClick={() => deleteMut.mutate(tip.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        </div>
      ))}
      {tips?.length === 0 && <p className="text-center text-muted-foreground py-8">No hay tips aún. Los tips de i18n se usan como fallback.</p>}
    </div>
  );
};

/* ───────────── PROGRAMS TAB ───────────── */
const ProgramsTab = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [editingDay, setEditingDay] = useState<any>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const { data: programs } = useQuery({
    queryKey: ["admin-programs"],
    queryFn: async () => {
      const { data } = await supabase.from("programs").select("*").order("sort_order");
      return data || [];
    },
  });

  const { data: days } = useQuery({
    queryKey: ["admin-program-days", selectedProgram],
    queryFn: async () => {
      const { data } = await supabase.from("program_days").select("*").eq("program_id", selectedProgram!).order("day_number");
      return data || [];
    },
    enabled: !!selectedProgram,
  });

  const saveProgramMut = useMutation({
    mutationFn: async (prog: any) => {
      if (prog.id) {
        const { error } = await supabase.from("programs").update({
          title: prog.title, slug: prog.slug, description: prog.description,
          duration_days: prog.duration_days, emoji: prog.emoji, category: prog.category, sort_order: prog.sort_order,
        }).eq("id", prog.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("programs").insert({
          title: prog.title, slug: prog.slug, description: prog.description,
          duration_days: prog.duration_days, emoji: prog.emoji, category: prog.category, sort_order: prog.sort_order,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-programs"] });
      setEditing(null);
      toast({ title: "Programa guardado ✓" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const saveDayMut = useMutation({
    mutationFn: async (day: any) => {
      if (day.id) {
        const { error } = await supabase.from("program_days").update({
          day_number: day.day_number, title: day.title, content: day.content,
          exercise: day.exercise, reflection_prompt: day.reflection_prompt,
        }).eq("id", day.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("program_days").insert({
          program_id: selectedProgram!, day_number: day.day_number, title: day.title,
          content: day.content, exercise: day.exercise, reflection_prompt: day.reflection_prompt,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-program-days"] });
      setEditingDay(null);
      toast({ title: "Día guardado ✓" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const blankProg = { title: "", slug: "", description: "", duration_days: 7, emoji: "📘", category: "general", sort_order: 0 };
  const blankDay = { day_number: (days?.length || 0) + 1, title: "", content: "", exercise: "", reflection_prompt: "" };

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-semibold text-lg">{editing.id ? "Editar programa" : "Nuevo programa"}</h3>
          <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Título" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <Input placeholder="Slug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
          <Input placeholder="Emoji" value={editing.emoji} onChange={(e) => setEditing({ ...editing, emoji: e.target.value })} />
          <Input placeholder="Categoría" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
          <Input type="number" placeholder="Duración (días)" value={editing.duration_days} onChange={(e) => setEditing({ ...editing, duration_days: Number(e.target.value) })} />
          <Input type="number" placeholder="Orden" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
        </div>
        <Textarea placeholder="Descripción" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={4} />
        <Button onClick={() => saveProgramMut.mutate(editing)} disabled={!editing.title || !editing.slug || saveProgramMut.isPending} className="w-full">
          <Save className="w-4 h-4 mr-2" /> Guardar
        </Button>
      </div>
    );
  }

  if (selectedProgram) {
    const prog = programs?.find((p: any) => p.id === selectedProgram);

    if (editingDay) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-semibold text-lg">{editingDay.id ? "Editar día" : "Nuevo día"}</h3>
            <Button variant="ghost" onClick={() => setEditingDay(null)}>Cancelar</Button>
          </div>
          <Input type="number" placeholder="Número de día" value={editingDay.day_number} onChange={(e) => setEditingDay({ ...editingDay, day_number: Number(e.target.value) })} />
          <Input placeholder="Título del día" value={editingDay.title} onChange={(e) => setEditingDay({ ...editingDay, title: e.target.value })} />
          <Textarea placeholder="Contenido" value={editingDay.content} onChange={(e) => setEditingDay({ ...editingDay, content: e.target.value })} rows={6} />
          <Textarea placeholder="Ejercicio" value={editingDay.exercise} onChange={(e) => setEditingDay({ ...editingDay, exercise: e.target.value })} rows={4} />
          <Textarea placeholder="Pregunta de reflexión" value={editingDay.reflection_prompt} onChange={(e) => setEditingDay({ ...editingDay, reflection_prompt: e.target.value })} rows={3} />
          <Button onClick={() => saveDayMut.mutate(editingDay)} disabled={!editingDay.title || saveDayMut.isPending} className="w-full">
            <Save className="w-4 h-4 mr-2" /> Guardar
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-lg">{prog?.emoji} {prog?.title}</h3>
          <Button variant="ghost" onClick={() => setSelectedProgram(null)}>← Volver</Button>
        </div>
        <Button onClick={() => setEditingDay(blankDay)} className="w-full"><Plus className="w-4 h-4 mr-2" /> Nuevo día</Button>
        {days?.map((d: any) => (
          <div key={d.id} className="glass rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-primary">Día {d.day_number}</span>
              <p className="text-sm font-medium text-foreground">{d.title}</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setEditingDay(d)}>Editar</Button>
          </div>
        ))}
        {days?.length === 0 && <p className="text-center text-muted-foreground py-8">No hay días aún</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button onClick={() => setEditing(blankProg)} className="w-full"><Plus className="w-4 h-4 mr-2" /> Nuevo programa</Button>
      {programs?.map((p: any) => (
        <div key={p.id} className="glass rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedProgram(p.id)}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{p.emoji}</span>
            <div>
              <span className="font-medium text-sm text-foreground">{p.title}</span>
              <p className="text-xs text-muted-foreground">{p.duration_days} días · {p.category}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setEditing(p); }}>Editar</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ───────────── FEEDBACK TAB ───────────── */
const FeedbackTab = () => {
  const { data: feedbackItems, isLoading } = useQuery({
    queryKey: ["admin-feedback"],
    queryFn: async () => {
      const { data } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const categoryColors: Record<string, string> = {
    suggestion: "bg-blue-100 text-blue-700",
    bug: "bg-red-100 text-red-700",
    content: "bg-purple-100 text-purple-700",
    design: "bg-pink-100 text-pink-700",
    other: "bg-gray-100 text-gray-700",
  };

  const categoryLabels: Record<string, string> = {
    suggestion: "Sugerencia",
    bug: "Error",
    content: "Contenido",
    design: "Diseño",
    other: "Otro",
  };

  if (isLoading) return <p className="text-center text-muted-foreground py-8">Cargando feedback...</p>;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{feedbackItems?.length || 0} mensajes de feedback</p>
      {feedbackItems?.map((fb: any) => (
        <div key={fb.id} className="glass rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${categoryColors[fb.category] || categoryColors.other}`}>
              {categoryLabels[fb.category] || fb.category}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {new Date(fb.created_at).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <p className="text-sm text-foreground">{fb.message}</p>
          <p className="text-[10px] text-muted-foreground font-mono truncate">user: {fb.user_id}</p>
        </div>
      ))}
      {feedbackItems?.length === 0 && <p className="text-center text-muted-foreground py-8">No hay feedback aún</p>}
    </div>
  );
};

/* ───────────── MAIN ADMIN PAGE ───────────── */
const Admin = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading } = useAdmin();

  if (!user) return <Navigate to="/auth" replace />;
  if (isLoading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Verificando permisos...</div>;
  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
      <ShieldCheck className="w-12 h-12 text-muted-foreground/40" />
      <h2 className="text-xl font-display font-semibold text-foreground">Acceso restringido</h2>
      <p className="text-muted-foreground text-sm">No tienes permisos de administrador.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-primary" /> Panel Admin
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Gestiona el contenido de Rooted Abroad</p>
      </div>

      <Tabs defaultValue="articles">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="articles" className="text-xs"><BookOpen className="w-4 h-4 mr-1" /> Artículos</TabsTrigger>
          <TabsTrigger value="prompts" className="text-xs"><MessageSquare className="w-4 h-4 mr-1" /> Prompts</TabsTrigger>
          <TabsTrigger value="tips" className="text-xs"><Lightbulb className="w-4 h-4 mr-1" /> Tips</TabsTrigger>
          <TabsTrigger value="programs" className="text-xs"><Layers className="w-4 h-4 mr-1" /> Programas</TabsTrigger>
          <TabsTrigger value="feedback" className="text-xs"><MessageSquareHeart className="w-4 h-4 mr-1" /> Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="articles"><ArticlesTab /></TabsContent>
        <TabsContent value="prompts"><PromptsTab /></TabsContent>
        <TabsContent value="tips"><TipsTab /></TabsContent>
        <TabsContent value="programs"><ProgramsTab /></TabsContent>
        <TabsContent value="feedback"><FeedbackTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
