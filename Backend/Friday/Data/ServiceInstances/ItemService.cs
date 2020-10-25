﻿using Friday.Data.IServices;
using Friday.Models;
using Friday.Models.Logs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Friday.Data.ServiceInstances
{/// <inheritdoc cref="IItemService" />
    public class ItemService : ServiceBase, IItemService
    {
        private readonly DbSet<Item> items;
        private readonly DbSet<ItemLog> logs;

        /// <summary>
        /// Service for Items.
        /// </summary>
        /// <param name="context">Link to DB</param>
        public ItemService(Context context) : base(context)
        {
            items = this.context.Items;
            logs = this.context.ItemLogs;

        }
        /// <inheritdoc />
        public async Task<IList<Item>> GetAll()
        {
            return await items.Include(s => s.ItemDetails).AsNoTracking().ToListAsync();

        }
        ///// <summary>
        ///// Returns the details of a specified Item
        ///// </summary>
        ///// <param name="id"></param>
        ///// <returns>ItemDetails, null if not found</returns>
        //public ItemDetails GetDetails(int id) {
        //    return details.AsNoTracking().SingleOrDefault(s => s.ItemId == id);
        //}


        /// <inheritdoc />
        public async Task<bool> ChangeCount(ShopUser user, int id, int amount)
        {
            if (user == null)
                throw new Exception();
            var item = await items.SingleAsync(s => s.Id == id);
            if ((amount < 0 && Math.Abs(amount) > item.Count))//Avoid negative numbers
                throw new ArgumentException("You can't change an Item's count below zero!");
            item.Count += amount;

            items.Update(item);

            await LogItem(user, item, amount);

            return await context.SaveChangesAsync() > 0;
        }
        /// <inheritdoc />
        private Task LogItem(ShopUser user, Item item, int amount)
        {
            var log = new ItemLog(user, amount, DateTime.Now, item);
            logs.Add(log);
            return context.SaveChangesAsync();
        }
        /// <inheritdoc />
        public async Task<bool> AddItem(Item item, ItemDetails details)
        {
            await items.AddAsync(item);//Add Item itself to data
            await context.SaveChangesAsync();//Save to generate the ID

            details.ItemId = item.Id;//Set ItemId with newly generated value from Item

            items.Update(item);//Sets the Item as updated to new Details are saved too
            await context.SaveChangesAsync();//Save to generated ID

            return item.Id != 0 && details.Id != 0 && await items.ContainsAsync(item);//Check if Item was successfully added and all values generated. This ensures proper saving.
        }
        /// <inheritdoc />
        public async Task<bool> DeleteItem(int id)
        {
            var item = await items.SingleAsync(s => s.Id == id);
            items.Remove(item);
            return await context.SaveChangesAsync() > 0; //False if nothing was written and the operation failed.

        }
        /// <inheritdoc />
        public async Task<bool> ChangeItem(Item item)
        {
            var old = await items.SingleAsync(s => item.Id == s.Id);
            old = item;
            items.Update(old);
            return await context.SaveChangesAsync() > 0;//True if at least 1 one line in the DB was changed
        }
    }
}
