"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DateTimePicker } from "@/components/date-time-picker"
import { MapPin, Text, Clock, PlusCircle } from "lucide-react"

export function CreateEventButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="shadow-lg w-3/4 h-12">
          <PlusCircle className="mr-2 h-5 w-5" /> イベントを追加
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>イベントを追加</DialogTitle>
          <DialogDescription>
            イベントを作成するための詳細をここで指定する。完了したら保存をクリックする。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-0">
            <Clock className="mr-4 h-4 w-4" />
            <Input id="name" type="datetime-local" />
          </div>
          <div className="flex items-center space-x-0">
            <MapPin className="mr-4 h-4 w-4" />
            <Input id="name" type="text" placeholder="発信元を追加" />
          </div>
          <div className="flex items-center space-x-0">
            <Text className="mr-4 h-4 w-4" />
            <Textarea placeholder="内容を追加"/>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="px-8">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
