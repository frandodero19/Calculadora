'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Euro, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Transaction = {
  id: string
  type: 'ingreso' | 'gasto'
  category: string
  amount: number
  description: string
  date: Date
}

const categories = {
  ingreso: ['Salario', 'Freelance', 'Inversiones', 'Otros'],
  gasto: ['Alimentación', 'Vivienda', 'Transporte', 'Servicios', 'Entretenimiento', 'Otros']
}

const categoryEmojis = {
  'Salario': '💼',
  'Freelance': '🖥️',
  'Inversiones': '📈',
  'Otros': '🔄',
  'Alimentación': '🍽️',
  'Vivienda': '🏠',
  'Transporte': '🚗',
  'Servicios': '📱',
  'Entretenimiento': '🎭'
}

export default function CalculadoraGastos() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id' | 'date'>>({
    type: 'gasto',
    category: '',
    amount: 0,
    description: ''
  })
  const [balance, setBalance] = useState(0)
  const [filter, setFilter] = useState<'all' | 'ingreso' | 'gasto'>('all')

  useEffect(() => {
    const newBalance = transactions.reduce((acc, transaction) => {
      return acc + (transaction.type === 'ingreso' ? transaction.amount : -transaction.amount)
    }, 0)
    setBalance(newBalance)
  }, [transactions])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewTransaction(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewTransaction(prev => ({ ...prev, [name]: value }))
  }

  const handleAddTransaction = () => {
    if (newTransaction.amount <= 0 || !newTransaction.category) return
    setTransactions(prev => [...prev, { ...newTransaction, id: Date.now().toString(), date: new Date() }])
    setNewTransaction({ type: 'gasto', category: '', amount: 0, description: '' })
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id))
  }

  const filteredTransactions = transactions.filter(transaction => 
    filter === 'all' || transaction.type === filter
  )

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center">Calculadora de Gastos Personal</CardTitle>
          <p className="text-center text-blue-100 mt-2 text-sm sm:text-base">Desarrollado por Fran Dodero</p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Saldo Actual</h2>
              <span className={`text-xl sm:text-2xl font-bold flex items-center ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <Euro className="h-5 w-5 sm:h-6 sm:w-6 mr-1" />
                {balance.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className="text-gray-700">Tipo</Label>
                <Select 
                  value={newTransaction.type} 
                  onValueChange={(value) => handleSelectChange('type', value as 'ingreso' | 'gasto')}
                >
                  <SelectTrigger className="bg-white border border-gray-300">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingreso">Ingreso</SelectItem>
                    <SelectItem value="gasto">Gasto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category" className="text-gray-700">Categoría</Label>
                <Select 
                  value={newTransaction.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger className="bg-white border border-gray-300">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[newTransaction.type].map(category => (
                      <SelectItem key={category} value={category}>
                        {categoryEmojis[category]} {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount" className="text-gray-700">Cantidad</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    id="amount" 
                    name="amount" 
                    value={newTransaction.amount || ''} 
                    onChange={handleInputChange} 
                    placeholder="Introducir cantidad"
                    className="pl-8 bg-white border border-gray-300"
                  />
                  <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-700">Descripción</Label>
                <Input 
                  type="text" 
                  id="description" 
                  name="description" 
                  value={newTransaction.description} 
                  onChange={handleInputChange} 
                  placeholder="Introducir descripción"
                  className="bg-white border border-gray-300"
                />
              </div>
            </div>

            <Button onClick={handleAddTransaction} className="w-full bg-green-500 hover:bg-green-600 text-white transition duration-200">
              <Plus className="mr-2 h-4 w-4" /> Añadir Transacción
            </Button>

            <div className="mt-4 sm:mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-0">Historial de Transacciones</h3>
                <Select value={filter} onValueChange={(value) => setFilter(value as 'all' | 'ingreso' | 'gasto')}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ingreso">Ingresos</SelectItem>
                    <SelectItem value="gasto">Gastos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {filteredTransactions.length === 0 ? (
                <p className="text-gray-500 text-center bg-white p-4 rounded-lg shadow-inner border border-gray-200">No hay transacciones que mostrar</p>
              ) : (
                <div className="space-y-3 max-h-60 sm:max-h-80 overflow-y-auto pr-2">
                  {filteredTransactions.map(transaction => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{categoryEmojis[transaction.category]}</span>
                        <div>
                          <span className={`font-semibold ${transaction.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'ingreso' ? '+' : '-'} €{transaction.amount.toFixed(2)}
                          </span>
                          <p className="text-sm text-gray-600">{transaction.category} - {transaction.description}</p>
                          <p className="text-xs text-gray-400">{transaction.date.toLocaleString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTransaction(transaction.id)} className="text-red-500 hover:text-red-700 transition duration-200">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Desarrollado por Fran Dodero</p>
                <p>Versión 1.0.0</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
    </div>
  )
}