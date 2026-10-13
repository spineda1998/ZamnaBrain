import React, { useState, useEffect } from 'react';
import { Classroom, StudentProgress, User } from '../types';
import { api } from '../api';
import { Users, Plus, Key, GraduationCap, Shield, CheckCircle2, ChevronRight } from 'lucide-react';

interface ClassroomViewProps {
  user: User;
}

export const ClassroomView: React.FC<ClassroomViewProps> = ({ user }) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const isTeacher = user.role === 'teacher';

  const loadClassrooms = async () => {
    try {
      setLoading(true);
      const data = await api.getClassrooms();
      setClassrooms(data);
      if (data.length > 0 && !selectedClassroom && isTeacher) {
        handleSelectClassroom(data[0]);
      }
    } catch (err) {
      console.error('Error cargando aulas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassrooms();
  }, []);

  const handleSelectClassroom = async (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    if (isTeacher) {
      try {
        const studentList = await api.getClassroomStudents(classroom.id);
        setStudents(studentList);
      } catch (err) {
        console.error('Error cargando estudiantes:', err);
      }
    }
  };

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    try {
      const created = await api.createClassroom(newClassName.trim());
      setActionMsg({ text: `¡Aula creada con código ${created.code}!` });
      setNewClassName('');
      loadClassrooms();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Error al crear aula', error: true });
    }
  };

  const handleJoinClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    try {
      const joined = await api.joinClassroom(joinCode.trim().toUpperCase());
      setActionMsg({ text: `¡Te has unido exitosamente al aula ${joined.name}!` });
      setJoinCode('');
      loadClassrooms();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Código de aula inválido', error: true });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Hero Header */}
      <div className="bg-[#211d17] border-4 border-[#a62b2b] p-6 rounded-lg text-center shadow-xl">
        <h2 className="font-press-start text-base sm:text-lg text-[#fbbf24] flex items-center justify-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#fbbf24]" />
          {isTeacher ? 'SALA DE MAESTROS DEL TEMPLO' : 'MI COMUNIDAD DE APRENDIZAJE'}
        </h2>
        <p className="font-silkscreen text-xs text-[#d1d5db] mt-2 max-w-lg mx-auto">
          {isTeacher
            ? 'Monitorea el progreso de tus alumnos en el Sendero Sagrado, crea aulas y comparte códigos de acceso.'
            : 'Únete a tu clase mediante el código proporcionado por tu profesor para competir en el aula.'}
        </p>
      </div>

      {actionMsg && (
        <div
          className={`p-3 rounded font-silkscreen text-xs border ${
            actionMsg.error
              ? 'bg-[#7f1d1d] text-red-200 border-red-500'
              : 'bg-[#14291c] text-[#86efac] border-[#22c55e]'
          }`}
        >
          {actionMsg.text}
        </div>
      )}

      {/* Action Panels: Create or Join */}
      <div className="bg-[#1c1c1c] border-2 border-[#333] p-5 rounded-lg shadow-md">
        {isTeacher ? (
          <form onSubmit={handleCreateClassroom} className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px]">
              <label className="font-silkscreen text-xs text-[#9ca3af] block mb-1">
                Nombre de la Nueva Aula / Grupo:
              </label>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Ej. 5° B — Guardianes de Chichén Itzá"
                className="w-full bg-[#111] border border-[#555] focus:border-[#d99b26] rounded px-3 py-2 font-silkscreen text-xs text-[#f4efe6] outline-none"
              />
            </div>
            <button
              type="submit"
              className="mt-5 px-4 py-2.5 bg-[#a62b2b] hover:bg-[#c0392b] text-[#f4efe6] border border-[#d99b26] rounded font-press-start text-xs retro-button flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> CREAR AULA
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoinClassroom} className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="font-silkscreen text-xs text-[#9ca3af] block mb-1">
                Código de Aula (proporcionado por tu profesor):
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Ej. KUKUL-04"
                className="w-full bg-[#111] border border-[#555] focus:border-[#22c55e] rounded px-3 py-2 font-press-start text-xs text-[#22c55e] uppercase outline-none"
              />
            </div>
            <button
              type="submit"
              className="mt-5 px-4 py-2.5 bg-[#14291c] hover:bg-[#1f3d2a] text-[#22c55e] border-2 border-[#22c55e] rounded font-press-start text-xs retro-button flex items-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4" /> UNIRSE AL AULA
            </button>
          </form>
        )}
      </div>

      {/* Classrooms List & Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Classrooms List */}
        <div className="space-y-3">
          <h3 className="font-press-start text-xs text-[#9ca3af]">
            AULAS INSCRITAS ({classrooms.length})
          </h3>
          <div className="space-y-2">
            {classrooms.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectClassroom(c)}
                className={`p-3 rounded border-2 transition cursor-pointer flex items-center justify-between ${
                  selectedClassroom?.id === c.id
                    ? 'bg-[#31250b] border-[#d99b26]'
                    : 'bg-[#1c1c1c] border-[#333] hover:border-[#555]'
                }`}
              >
                <div>
                  <h4 className="font-press-start text-xs text-[#f4efe6]">
                    {c.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 font-silkscreen text-[11px] text-[#9ca3af]">
                    <span className="bg-[#111] px-1.5 py-0.5 rounded text-[#fbbf24] font-mono border border-[#444]">
                      {c.code}
                    </span>
                    <span>{c.studentCount} Alumnos</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#888]" />
              </div>
            ))}
          </div>
        </div>

        {/* Selected Classroom Details & Students (for Teacher) */}
        <div className="md:col-span-2 bg-[#1c1c1c] border-2 border-[#444] p-5 rounded-lg shadow-lg min-h-[300px]">
          {selectedClassroom ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#333] pb-3">
                <div>
                  <span className="font-silkscreen text-xs text-[#fbbf24]">
                    CÓDIGO DE ACCESO: <strong className="font-mono text-sm underline">{selectedClassroom.code}</strong>
                  </span>
                  <h3 className="font-press-start text-sm text-[#f4efe6] mt-1">
                    {selectedClassroom.name}
                  </h3>
                </div>
                <div className="font-silkscreen text-xs text-[#22c55e] bg-[#14291c] px-2.5 py-1 rounded border border-[#22c55e]">
                  {selectedClassroom.studentCount} Alumnos Registrados
                </div>
              </div>

              {isTeacher ? (
                <div>
                  <h4 className="font-press-start text-xs text-[#fbbf24] mb-3">
                    ALUMNOS Y PROGRESO DETALLADO
                  </h4>
                  {students.length === 0 ? (
                    <p className="font-silkscreen text-xs text-[#888]">
                      Aún no hay alumnos inscritos con el código {selectedClassroom.code}.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#2a2a2a] bg-[#141414] rounded border border-[#333]">
                      {students.map((st) => (
                        <div
                          key={st.user.id}
                          className="p-3 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-press-start text-xs text-[#f4efe6]">
                              {st.user.nickname}
                            </span>
                            <span className="ml-2 font-silkscreen text-[11px] text-[#888]">
                              {st.user.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 font-silkscreen text-xs">
                            <span className="text-[#22c55e]">🟢 {st.jadeCoins}</span>
                            <span className="text-[#fbbf24]">⭐ {st.totalStars}</span>
                            <span className="text-[#9ca3af]">
                              {st.nodesCompleted} Nodos
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-[#141414] rounded border border-[#333] font-silkscreen text-xs text-[#ccc] space-y-2">
                  <p>
                    Estás inscrito en esta aula ceremonial. Todo tu progreso en el Sendero Sagrado se comparte automáticamente con tu profesor y con la tabla de clasificación del aula.
                  </p>
                  <p className="text-[#fbbf24]">
                    ¡Sigue resolviendo retos para alcanzar el primer lugar en tu grupo!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center font-silkscreen text-sm text-[#777]">
              Selecciona un aula para ver sus detalles.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
