<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sparepart_id' => ['required', 'integer', 'exists:spareparts,id'],
            'supplier_id' => ['nullable', 'integer', 'exists:suppliers,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
            'source_type' => ['nullable', 'string', 'max:30'],
            'transaction_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
