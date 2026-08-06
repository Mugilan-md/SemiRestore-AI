import React, { useState, useEffect } from 'react';
import { PipelineStage } from '../../types/semicon';
import { INITIAL_PIPELINE_STAGES } from '../../services/mockBackendApi';
import {
  Play,
  CheckCircle2,
  Clock,
  Cpu,
  Terminal,
  Activity,
  Zap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LivePipelineMonitor: React.FC = () => {
  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_PIPELINE_STAGES);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(-1);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[INIT] Restormer PyTorch CUDA Pipeline Engine 2.4 Ready',
    '[GPU] NVIDIA H100 SXM5 80GB Allocated on Fab-Node-04',
    '[SYSTEM] Awaiting user trigger for 16-bit SEM array inspection...',
  ]);

  const startPipeline = () => {
    setIsRunning(true);
    setCurrentStageIdx(0);
    setStages(INITIAL_PIPELINE_STAGES.map((s) => ({ ...s, status: 'pending', progress: 0 })));

    let idx = 0;
    const executeStage = () => {
      if (idx >= INITIAL_PIPELINE_STAGES.length) {
        setIsRunning(false);
        setConsoleLogs((prev) => [
          ...prev,
          '[SUCCESS] All 9 Pipeline Stages Completed. Metrology Certificate Ready.',
        ]);
        return;
      }

      setCurrentStageIdx(idx);
      setStages((prev) =>
        prev.map((stg, i) => {
          if (i < idx) return { ...stg, status: 'completed', progress: 100 };
          if (i === idx) return { ...stg, status: 'processing', progress: 50 };
          return stg;
        })
      );

      setConsoleLogs((prev) => [
        ...prev,
        `[STAGE ${idx + 1}] Executing: ${INITIAL_PIPELINE_STAGES[idx].name}...`,
        `[CUDA] Memory chunk allocated: ${(4.2 + idx * 0.4).toFixed(1)} GB`,
      ]);

      setTimeout(() => {
        setStages((prev) =>
          prev.map((stg, i) => (i === idx ? { ...stg, status: 'completed', progress: 100 } : stg))
        );
        idx++;
        executeStage();
      }, 700);
    };

    executeStage();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Control */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
              PYTORCH RESTORMER ENGINE
            </span>
            <h2 className="font-poppins text-lg font-bold text-slate-900">
              Live AI Restoration Pipeline Monitor
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time execution status for all 9 deep learning metrology stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={startPipeline}
            disabled={isRunning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition shadow-md ${
              isRunning
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
            }`}
          >
            {isRunning ? <Cpu className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-white" />}
            <span>{isRunning ? 'Processing Pipeline...' : 'Run Full AI Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Main Content: Stages Grid & Real-time Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Pipeline Stage Cards */}
        <div className="lg:col-span-7 space-y-3">
          {stages.map((stg, index) => {
            const isCurrent = currentStageIdx === index;
            const isCompleted = stg.status === 'completed';

            return (
              <div
                key={stg.id}
                className={`glass-panel rounded-2xl p-4 border transition-all ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-md'
                    : isCompleted
                    ? 'border-emerald-200 bg-white'
                    : 'border-slate-200 bg-white opacity-70'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white animate-pulse'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{stg.name}</h4>
                      <p className="text-[11px] text-slate-500">{stg.description}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700'
                        : isCurrent
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isCompleted ? 'Completed' : isCurrent ? 'Processing...' : 'Pending'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isCompleted ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${stg.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 5 Cols: CUDA Console Stream */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-3xl p-5 border border-slate-800 bg-slate-950 text-white h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-xs font-bold font-mono text-cyan-400">
                    PyTorch CUDA Tensor Console Log
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500">FP16 TensorRT</span>
              </div>

              <div className="space-y-2 font-mono text-[11px] text-slate-300 max-h-96 overflow-y-auto pr-2">
                {consoleLogs.map((log, i) => (
                  <div key={i} className="leading-normal">
                    <span className="text-blue-400 font-semibold">{log.split(' ')[0]}</span>{' '}
                    <span>{log.substring(log.indexOf(' ') + 1)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
              <span>Status: {isRunning ? 'Streaming CUDA Kernels...' : 'Idle'}</span>
              <span>Node: Fab-04-H100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
