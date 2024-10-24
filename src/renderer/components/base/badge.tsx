import clsx from 'clsx'
import React from 'react'


const colors = {
  // Administration
  namespace: 'border text-neutral-400 border-neutral-400/40 dark:text-neutral-400 dark:border-neutral-400/50',
  context: 'border text-neutral-400 border-neutral-400/40 dark:text-neutral-400 dark:border-neutral-400/50',
  node: 'border text-neutral-400 border-neutral-400/40 dark:text-neutral-400 dark:border-neutral-400/50',

  // Workloads
  deployment: 'border text-blue-400 border-blue-400/50 dark:text-blue-400 dark:border-blue-400/50',
  pod: 'border text-blue-200 border-blue-200/50 dark:text-blue-200 dark:border-blue-200/50',
  replicaSet: 'border text-blue-600 border-blue-600/50 dark:text-blue-600 dark:border-blue-600/50',
  statefulSet: 'border text-blue-400 border-blue-400/50 dark:text-blue-400 dark:border-blue-400/50',
  daemonSet: 'border text-blue-400 border-blue-400/50 dark:text-blue-400 dark:border-blue-400/50',
  job: 'border text-blue-200 border-blue-200/50 dark:text-blue-200 dark:border-blue-200/50',
  cronJob: 'border text-blue-400 border-blue-400/50 dark:text-blue-400 dark:border-blue-400/50',

  // Networking
  service: 'border text-green-500 border-green-500/50 dark:text-green-500 dark:border-green-500/50',
  ingress: 'border text-green-300 border-green-300/50 dark:text-green-300 dark:border-green-300/50',
  ingressClass: 'border text-green-300 border-green-300/50 dark:text-green-300 dark:border-green-300/50',
  endpoint: 'border text-green-700 border-green-700/50 dark:text-green-700 dark:border-green-700/50',
  endpointSlice: 'border text-green-700 border-green-700/50 dark:text-green-700 dark:border-green-700/50',
  networkPolicy: 'border text-green-200 border-green-200/50 dark:text-green-200 dark:border-green-200/50',

  // Configuration
  configMap: 'border text-orange-400 border-orange-400/50 dark:text-orange-400 dark:border-orange-400/50',
  secret: 'border text-orange-700 border-orange-700/50 dark:text-orange-700 dark:border-orange-700/50',
  resourceQuota: 'border text-orange-200 border-orange-200/50 dark:text-orange-200 dark:border-orange-200/50',
  limitRange: 'border text-orange-200 border-orange-200/50 dark:text-orange-200 dark:border-orange-200/50',
  horizontalPodAutoscaler: 'border text-orange-500 border-orange-500/50 dark:text-orange-500 dark:border-orange-500/50',
  podDisruptionBudget: 'border text-orange-500 border-orange-500/50 dark:text-orange-500 dark:border-orange-500/50',

  // Storage
  persistentVolumeClaim: 'border text-yellow-300 border-yellow-300/50 dark:text-yellow-300 dark:border-yellow-300/50',
  persistentVolume: 'border text-yellow-500 border-yellow-500/50 dark:text-yellow-500 dark:border-yellow-500/50',
  volumeAttachment: 'border text-[#e6db74] border-[#e6db74]/50 dark:text-[#e6db74] dark:border-[#e6db74]/50',
  storageClass: 'border text-yellow-600 border-yellow-600/50 dark:text-yellow-600 dark:border-yellow-600/50',
  CSIDriver: 'border text-yellow-800 border-yellow-800/50 dark:text-yellow-800 dark:border-yellow-800/50',
  CSINode: 'border text-yellow-800 border-yellow-800/50 dark:text-yellow-800 dark:border-yellow-800/50',

  // Access Control
  serviceAccount: 'border text-pink-700 border-pink-700/50 dark:text-pink-700 dark:border-pink-700/50',
  role: 'border text-pink-500 border-pink-500/50 dark:text-pink-500 dark:border-pink-500/50',
  roleBinding: 'border text-pink-300 border-pink-300/50 dark:text-pink-300 dark:border-pink-300/50',
  clusterRole: 'border text-pink-500 border-pink-500/50 dark:text-pink-500 dark:border-pink-500/50',
  clusterRoleBinding: 'border text-pink-300 border-pink-300/50 dark:text-pink-300 dark:border-pink-300/50',

  priorityClass: 'border text-neutral-600 border-neutral-600/50 dark:text-neutral-600 dark:border-neutral-600/50',
  runtimeClass: 'border text-neutral-600 border-neutral-600/50 dark:text-neutral-600 dark:border-neutral-600/50',
  mutatingWebhookConfiguration: 'border text-neutral-300 border-neutral-300/50 dark:text-neutral-300 dark:border-neutral-300/50',
  validatingWebhookConfiguration: 'border text-neutral-300 border-neutral-300/50 dark:text-neutral-300 dark:border-neutral-300/50',

  // Pro
  pro: 'border text-neutral-400 border-neutral-400/40 dark:text-neutral-400 dark:border-neutral-400/50',
  
  // Standard colors
  red: 'border text-red-700/75 border-red-700/25 dark:text-red-400/75 dark:border-red-400/25',
  orange: 'border text-orange-700/75 border-orange-700/25 dark:text-orange-400/75 dark:border-orange-400/25',
  amber: 'border text-amber-700/75 border-amber-700/25 dark:text-amber-400/75 dark:border-amber-400/25',
  yellow: 'border text-yellow-700/75 border-yellow-700/25 dark:text-yellow-400/75 dark:border-yellow-400/25',
  lime: 'border text-lime-700/75 border-lime-700/25 dark:text-lime-400/75 dark:border-lime-400/25',
  green: 'border text-green-700/75 border-green-700/25 dark:text-green-400/75 dark:border-green-400/25',
  emerald: 'border text-emerald-700/75 border-emerald-700/25 dark:text-emerald-400/75 dark:border-emerald-400/25',
  teal: 'border text-teal-700/75 border-teal-700/25 dark:text-teal-400/75 dark:border-teal-400/25',
  cyan: 'border text-cyan-700/75 border-cyan-700/25 dark:text-cyan-400/75 dark:border-cyan-400/25',
  sky: 'border text-sky-700/75 border-sky-700/25 dark:text-sky-400/75 dark:border-sky-400/25',
  blue: 'border text-blue-700/75 border-blue-700/25 dark:text-blue-400/75 dark:border-blue-400/25',
  indigo: 'border text-indigo-700/75 border-indigo-700/25 dark:text-indigo-400/75 dark:border-indigo-400/25',
  violet: 'border text-violet-700/75 border-violet-700/25 dark:text-violet-400/75 dark:border-violet-400/25',
  purple: 'border text-purple-700/75 border-purple-700/25 dark:text-purple-400/75 dark:border-purple-400/25',
  fuchsia: 'border text-fuchsia-700/75 border-fuchsia-700/25 dark:text-fuchsia-400/75 dark:border-fuchsia-400/25',
  pink: 'border text-pink-700/75 border-pink-700/25 dark:text-pink-400/75 dark:border-pink-400/25',
  rose: 'border text-rose-700/75 border-rose-700/25 dark:text-rose-400/75 dark:border-rose-400/25',
  zinc: 'border text-zinc-700/75 border-zinc-700/25 dark:text-zinc-400/75 dark:border-zinc-400/25',
}

type BadgeProps = { color?: keyof typeof colors }

export function Badge({ color = 'zinc', className, ...props }: BadgeProps & React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      className={clsx(
        className,
        'inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium forced-colors:outline',
        colors[color]
      )}
    />
  )
}
