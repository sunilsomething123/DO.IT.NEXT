import React, { useState, useMemo } from 'react'
import { Card, DatePicker, Select } from 'antd'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select

type Objective = {
  id: string
  title: string
  progress: number
  date: string
}

type Project = {
  id: string
  title: string
  completed: boolean
  date: string
}

type SelfEsteemScore = {
  id: string
  score: number
  date: string
}

type FilterOptions = {
  timePeriod: string
  aspect: string
}

type Props = {
  objectives: Objective[]
  projects: Project[]
  selfEsteemScores: SelfEsteemScore[]
  filterOptions: FilterOptions
}

const ProgressGraph: React.FC<Props> = ({
  objectives,
  projects,
  selfEsteemScores,
  filterOptions,
}) => {
  const [timePeriod, setTimePeriod] = useState<
    [dayjs.Dayjs, dayjs.Dayjs] | null
  >(null)
  const [aspect, setAspect] = useState<string>(filterOptions.aspect)

  const filteredObjectives = useMemo(() => {
    if (!timePeriod) return objectives
    return objectives.filter(obj =>
      dayjs(obj.date).isBetween(timePeriod[0], timePeriod[1], null, '[]'),
    )
  }, [objectives, timePeriod])

  const filteredProjects = useMemo(() => {
    if (!timePeriod) return projects
    return projects.filter(proj =>
      dayjs(proj.date).isBetween(timePeriod[0], timePeriod[1], null, '[]'),
    )
  }, [projects, timePeriod])

  const filteredSelfEsteemScores = useMemo(() => {
    if (!timePeriod) return selfEsteemScores
    return selfEsteemScores.filter(score =>
      dayjs(score.date).isBetween(timePeriod[0], timePeriod[1], null, '[]'),
    )
  }, [selfEsteemScores, timePeriod])

  const data = useMemo(() => {
    const combinedData: any[] = []

    filteredObjectives.forEach(obj => {
      combinedData.push({ date: obj.date, objectives: obj.progress })
    })

    filteredProjects.forEach(proj => {
      combinedData.push({ date: proj.date, projects: proj.completed ? 1 : 0 })
    })

    filteredSelfEsteemScores.forEach(score => {
      combinedData.push({ date: score.date, selfEsteemScores: score.score })
    })

    return combinedData.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
  }, [filteredObjectives, filteredProjects, filteredSelfEsteemScores])

  return (
    <Card>
      <div className="flex justify-between mb-4">
        <RangePicker onChange={dates => setTimePeriod(dates)} />
        <Select value={aspect} onChange={value => setAspect(value)}>
          <Option value="objectives">Objectives</Option>
          <Option value="projects">Projects</Option>
          <Option value="selfEsteemScores">Self Esteem Scores</Option>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {aspect === 'objectives' && (
            <Line type="monotone" dataKey="objectives" stroke="#8884d8" />
          )}
          {aspect === 'projects' && (
            <Line type="monotone" dataKey="projects" stroke="#82ca9d" />
          )}
          {aspect === 'selfEsteemScores' && (
            <Line type="monotone" dataKey="selfEsteemScores" stroke="#ffc658" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default ProgressGraph
