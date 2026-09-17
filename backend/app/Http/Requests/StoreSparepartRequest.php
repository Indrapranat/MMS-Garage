<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSparepartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', 'unique:spareparts,code'],
            'name' => ['required', 'string', 'max:150'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'unit' => ['nullable', 'string', 'max:20'],
            'current_stock' => ['nullable', 'integer', 'min:0'],
            'holding_cost' => ['nullable', 'numeric', 'min:0'],
            'safety_stock' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            // Opsional menghubungkan supplier utama langsung saat create
            'supplier_id' => ['nullable', 'integer', 'exists:suppliers,id'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'ordering_cost' => ['nullable', 'numeric', 'min:0'],
            'lead_time' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
