<?php

namespace App\Http\Resources\Order;

use App\Http\Resources\Customer\CustomerResource;
use App\Http\Resources\Product\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'customer'          => new CustomerResource($this->whenLoaded('customer')),
            'status'            => $this->status,
            'notes'             => $this->notes,
            'totalAmount'      => $this->total_amount,
            'shippingAddress'  => $this->shipping_address,
            'createdAt'       => $this->created_at?->format('Y-m-d H:i:s'),
            'updatedAt'       => $this->updated_at?->format('Y-m-d H:i:s'),
            'products'          => ProductResource::collection($this->whenLoaded('products')),
        ];
    }
}
