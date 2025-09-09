<?php

namespace App\Http\Resources\Product;

use App\Http\Resources\Category\CategoryResource;
use App\Http\Resources\ProductImage\ProductImageResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $imageUrl = optional($this->whenLoaded('image'))?->url
            ?? optional($this->image)->url
            ?? 'https://via.placeholder.com/800x800.png?text=Product';
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'description'       => $this->description,
            'price'             => $this->price,
            'isActive'         => $this->is_active,
            "category" => new CategoryResource(
                $this->whenLoaded('category')
            ),
            // For frontend convenience during testing
            'imageUrl' => $imageUrl,
            "image" => new ProductImageResource($this->whenLoaded('image'))
        ];
    }
}
