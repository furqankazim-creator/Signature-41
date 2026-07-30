import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50',
  {
    variants: {
      variant: {
        primary: 'bg-navy-900 text-cream-50 hover:bg-navy-800',
        gold: 'bg-gold-500 text-navy-950 hover:bg-gold-600',
        outline: 'border border-navy-900/15 bg-transparent text-navy-900 hover:bg-navy-900/5',
        ghost: 'bg-transparent text-navy-900 hover:bg-navy-900/5',
        subtle: 'bg-cream-200 text-navy-800 hover:bg-cream-200/70',
        destructive: 'bg-rose-500 text-white hover:bg-rose-500/90',
      },
      size: {
        default: 'h-10 px-5',
        sm: 'h-9 px-4 text-[13px]',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  }
)
Button.displayName = 'Button'
