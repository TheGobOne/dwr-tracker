'use client'

import { useRef, useState } from 'react'
import { Download, RotateCcw, Undo2, Upload } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTracker } from './tracker-context'

export function TrackerHeader() {
  const { seed, setSeed, canUndo, undo, reset, exportSave, importSave } = useTracker()
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  function handleExport() {
    const data = exportSave()
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const safeSeed = seed.trim().replace(/[^\w-]+/g, '_') || 'run'
    a.href = url
    a.download = `dwr-tracker-${safeSeed}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      importSave(JSON.parse(await file.text()))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read that file.')
    }
  }

  return (
    <header className="dw-window flex shrink-0 flex-wrap items-center gap-2 px-2.5 py-1.5">
      <h1 className="font-display text-[10px] leading-none text-primary">
        DWR <span className="text-foreground">Tracker</span>
      </h1>

      <Input
        value={seed}
        onChange={(e) => setSeed(e.target.value)}
        placeholder="Seed / flags"
        aria-label="Seed or flags"
        maxLength={80}
        className="h-7 min-w-0 flex-1 text-sm text-foreground"
      />

      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon-sm" onClick={undo} disabled={!canUndo} aria-label="Undo" title="Undo (Ctrl+Z)">
          <Undo2 aria-hidden="true" />
        </Button>
        <Button variant="outline" size="icon-sm" onClick={handleExport} aria-label="Save run to file" title="Save">
          <Download aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => fileRef.current?.click()}
          aria-label="Load run from file"
          title="Load"
        >
          <Upload aria-hidden="true" />
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={handleImport}
        />
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="destructive" size="icon-sm" aria-label="New run" title="New run" />}
          >
            <RotateCcw aria-hidden="true" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Start a new run?</AlertDialogTitle>
              <AlertDialogDescription>
                This clears the map, markers, items, spells and notes. Save first if you want to keep this seed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep playing</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={reset}>
                Clear everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {error && (
        <p role="alert" className="w-full text-xs text-destructive">
          {error}
        </p>
      )}
    </header>
  )
}
