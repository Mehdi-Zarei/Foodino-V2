import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CustomAuthGuard } from "src/common/guards/customAuthGuard";
import { Request } from "express";

@ApiTags("Cart")
@UseGuards(CustomAuthGuard)
@ApiBearerAuth("accessToken")
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: "Users can view their shopping cart." })
  @Get()
  getCart(@Req() req: Request) {
    const userId = req.user.id;
    return this.cartService.getCart(userId);
  }

  @ApiOperation({ summary: "Users can add products to their shopping cart." })
  @Post("add/:productId")
  addToCart(@Req() req: Request, @Param("productId", ParseIntPipe) productId: number) {
    const userId = req.user.id;
    return this.cartService.addToCart(userId, productId);
  }

  @ApiOperation({ summary: "Users can add products to their shopping cart." })
  @Delete("remove/:productId")
  removeFromCart(@Req() req: Request, @Param("productId", ParseIntPipe) productId: number) {
    const userId = req.user.id;
    return this.cartService.removeFromCart(userId, productId);
  }
}
