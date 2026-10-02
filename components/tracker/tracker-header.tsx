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
    <header className="dw-window flex flex-wrap items-center gap-3 px-4 py-3">
      <div className="mr-auto flex flex-col gap-1">
        <h1 className="font-display text-xs leading-relaxed text-primary sm:text-sm">Dragon Warrior Randomizer</h1>
        <p className="text-sm text-muted-foreground">Overworld map tracker</p>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-display text-[10px] uppercase">Seed</span>
        <Input
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="Seed / flags"
          maxLength={80}
          className="h-8 w-44 text-foreground"
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
          <Undo2 data-icon="inline-start" aria-hidden="true" />
          Undo
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download data-icon="inline-start" aria-hidden="true" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload data-icon="inline-start" aria-hidden="true" />
          Load
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
          <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
            <RotateCcw data-icon="inline-start" aria-hidden="true" />
            New run
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
        <p role="alert" className="w-full text-sm text-destructive">
          {error}
        </p>
      )}
    </header>
  )
}
